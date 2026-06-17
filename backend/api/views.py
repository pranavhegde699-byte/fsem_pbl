import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson.objectid import ObjectId
from django.conf import settings
from .db import (
    workers_collection, scores_collection, schemes_collection, documents_collection,
    ping_mongo,
)
from .utils import generate_jwt, decode_jwt
from .score_engine import parse_upi_pdf, calculate_workproof_score
from .scheme_router import match_schemes
from .pdf_generator import generate_financial_pdf_data_uri

@api_view(['GET'])
def api_index(request):
    ok, message = ping_mongo()
    return Response({
        'status': 'ok' if ok else 'degraded',
        'service': 'WorkProof Credit Rating API',
        'message': 'Welcome to WorkProof Alternative Credit Rating API. Both MongoDB and Django are active.',
        'mongo_connection': 'Healthy' if ok else f'Failed: {message}',
        'endpoints': {
            'health': '/api/health/mongo',
            'register_worker': '/api/workers/register',
            'login_worker': '/api/workers/login',
            'upload_upi_pdf': '/api/uploads/upi-pdf',
            'calculate_score': '/api/scores/calculate/<worker_id>',
            'latest_score': '/api/scores/<worker_id>/latest',
            'match_schemes': '/api/schemes/match/<worker_id>',
            'generate_document': '/api/documents/generate/<worker_id>',
            'latest_document': '/api/documents/<worker_id>/latest',
        }
    })

@api_view(['GET'])
def mongo_health(request):
    ok, message = ping_mongo()
    if not ok:
        return Response(
            {
                'status': 'error',
                'message': message,
                'mongo_uri': settings.MONGO_URI.split('@')[-1] if '@' in settings.MONGO_URI else settings.MONGO_URI,
                'database': settings.MONGO_DB_NAME,
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    return Response({
        'status': 'ok',
        'database': settings.MONGO_DB_NAME,
        'server_time': datetime.datetime.utcnow().isoformat(),
        'collections': {
            'workers': workers_collection.count_documents({}),
            'scores': scores_collection.count_documents({}),
            'schemes': schemes_collection.count_documents({}),
            'documents': documents_collection.count_documents({}),
        },
    })


def get_auth_worker_id(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    return decode_jwt(token)


def serialize_worker(worker):
    """Return worker dict safe for API responses (no huge PDF text fields)."""
    if not worker:
        return None
    out = dict(worker)
    out['_id'] = str(out['_id'])
    out.pop('latest_extracted_text', None)
    return out

@api_view(['POST'])
def register_worker(request):
    data = request.data
    aadhaar = data.get('aadhaar')
    phone = data.get('phone')
    
    if not aadhaar or not phone:
        return Response({'error': 'Aadhaar and phone are required'}, status=status.HTTP_400_BAD_REQUEST)

    if workers_collection.find_one({'aadhaar': aadhaar}):
        return Response({'error': 'Aadhaar already registered'}, status=status.HTTP_400_BAD_REQUEST)
    
    now = datetime.datetime.utcnow()
    worker = {
        'aadhaar': aadhaar,
        'phone': phone,
        'language': data.get('language', 'en'),
        'name': data.get('name', 'Worker'),
        'created_at': now,
        'last_login_at': now,
        'login_count': 1,
    }
    result = workers_collection.insert_one(worker)
    worker_id = str(result.inserted_id)
    token = generate_jwt(worker_id)
    worker['_id'] = result.inserted_id

    return Response({
        'token': token,
        'worker': {**serialize_worker(worker), 'id': worker_id},
    })

@api_view(['POST'])
def login_worker(request):
    data = request.data
    aadhaar = data.get('aadhaar')
    phone = data.get('phone')
    
    worker = workers_collection.find_one({'aadhaar': aadhaar, 'phone': phone})
    if not worker:
        return Response({'error': 'Invalid Aadhaar or Phone'}, status=status.HTTP_401_UNAUTHORIZED)

    now = datetime.datetime.utcnow()
    workers_collection.update_one(
        {'_id': worker['_id']},
        {'$set': {'last_login_at': now}, '$inc': {'login_count': 1}},
    )
    worker = workers_collection.find_one({'_id': worker['_id']})
    worker_id = str(worker['_id'])
    token = generate_jwt(worker_id)

    return Response({
        'token': token,
        'worker': {**serialize_worker(worker), 'id': worker_id},
    })

@api_view(['GET', 'PUT'])
def worker_detail(request, pk):
    worker_id = get_auth_worker_id(request)
    if not worker_id or worker_id != pk:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        worker = workers_collection.find_one({'_id': ObjectId(pk)})
        if not worker:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'worker': serialize_worker(worker)})

    if request.method == 'PUT':
        data = request.data
        update_fields = {k: v for k, v in data.items() if k != '_id'}
        update_fields['updated_at'] = datetime.datetime.utcnow()

        workers_collection.update_one({'_id': ObjectId(pk)}, {'$set': update_fields})
        worker = workers_collection.find_one({'_id': ObjectId(pk)})
        return Response({'worker': serialize_worker(worker)})

@api_view(['POST'])
def upload_upi_pdf(request):
    worker_id = get_auth_worker_id(request)
    if not worker_id:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    worker = workers_collection.find_one({'_id': ObjectId(worker_id)})
    if not worker:
        return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)
        
    pdf_file = request.FILES.get('pdf')
    if not pdf_file:
        return Response({'error': 'No PDF file provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Reject files larger than 5 MB to prevent abuse
    max_size = 5 * 1024 * 1024
    if pdf_file.size > max_size:
        return Response({'error': 'File too large. Maximum size is 5 MB.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        raw_text, parsed_summary = parse_upi_pdf(pdf_file)
    except ValueError as e:
        # Purge all previous database calculations so "credits/passports" are not shown if validation fails
        workers_collection.update_one(
            {'_id': ObjectId(worker_id)},
            {'$unset': {'latest_extracted_text': '', 'parsed_summary': ''}}
        )
        scores_collection.delete_many({'worker_id': worker_id})
        documents_collection.delete_many({'worker_id': worker_id})
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    workers_collection.update_one(
        {'_id': ObjectId(worker_id)},
        {'$set': {
            'latest_extracted_text': raw_text,
            'parsed_summary': parsed_summary
        }}
    )
    
    return Response({'message': 'PDF uploaded and text extracted successfully'})

@api_view(['POST'])
def calculate_score(request, pk):
    worker_id = get_auth_worker_id(request)
    if not worker_id or worker_id != pk:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    worker = workers_collection.find_one({'_id': ObjectId(pk)})
    if not worker:
        return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)
        
    parsed_summary = worker.get('parsed_summary')
    if not parsed_summary:
        return Response({'error': 'No summary found. Upload PDF first.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        score_data = calculate_workproof_score(worker, parsed_summary)
        
        score_record = {
            'worker_id': pk,
            **score_data,
            'created_at': datetime.datetime.utcnow()
        }
        
        result = scores_collection.insert_one(score_record)
        score_record['_id'] = str(result.inserted_id)
        
        return Response({'score': score_record})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_latest_score(request, pk):
    worker_id = get_auth_worker_id(request)
    if not worker_id or worker_id != pk:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    score = scores_collection.find({'worker_id': pk}).sort('created_at', -1).limit(1)
    score_list = list(score)
    if not score_list:
        return Response({'error': 'No score found'}, status=status.HTTP_404_NOT_FOUND)
        
    latest_score = score_list[0]
    latest_score['_id'] = str(latest_score['_id'])
    return Response({'score': latest_score})

@api_view(['GET'])
def match_schemes_api(request, pk):
    worker_id = get_auth_worker_id(request)
    if not worker_id or worker_id != pk:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    score = scores_collection.find({'worker_id': pk}).sort('created_at', -1).limit(1)
    score_list = list(score)
    if not score_list:
        return Response({'error': 'No score found to match schemes'}, status=status.HTTP_400_BAD_REQUEST)
        
    latest_score = score_list[0]
    
    try:
        worker = workers_collection.find_one({'_id': ObjectId(pk)})
        if not worker:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)
        schemes_data = match_schemes(worker, latest_score.get('total_score', 0))
        return Response({'matched_schemes': schemes_data})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def generate_document(request, pk):
    worker_id = get_auth_worker_id(request)
    if not worker_id or worker_id != pk:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    data = request.data
    language = data.get('language', 'English')
    score_id = data.get('scoreId')
    
    if score_id:
        try:
            score = scores_collection.find_one({'_id': ObjectId(score_id)})
        except Exception:
            score = None
    else:
        score = None

    if not score:
        score_cursor = scores_collection.find({'worker_id': pk}).sort('created_at', -1).limit(1)
        score_list = list(score_cursor)
        score = score_list[0] if score_list else None

    if not score:
        return Response({'error': 'No score found'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        worker = workers_collection.find_one({'_id': ObjectId(pk)})
        if not worker:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)
        worker['_id'] = str(worker['_id'])

        parsed_summary = worker.get('parsed_summary', {})
        schemes = match_schemes(worker, score.get('total_score', 0))
        explanation_obj = score.get('explanations', {})
        explanation = explanation_obj.get(language, explanation_obj.get('en', ''))
        
        file_url = generate_financial_pdf_data_uri(
            worker=worker,
            score=score,
            parsed_summary=parsed_summary,
            schemes=schemes,
            explanation=explanation,
            language=language
        )
        
        doc_record = {
            'worker_id': pk,
            'language': language,
            'content': explanation,
            'file_url': file_url,
            'created_at': datetime.datetime.utcnow()
        }
        
        result = documents_collection.insert_one(doc_record)
        doc_record['_id'] = str(result.inserted_id)
        
        return Response({'document': doc_record, 'file_url': file_url})
    except Exception as e:
        import traceback
        return Response({'error': str(e), 'trace': traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_latest_document(request, pk):
    worker_id = get_auth_worker_id(request)
    if not worker_id or worker_id != pk:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    docs = documents_collection.find({'worker_id': pk}).sort('created_at', -1).limit(1)
    doc_list = list(docs)
    if not doc_list:
        return Response({'error': 'No document found'}, status=status.HTTP_404_NOT_FOUND)
        
    latest_doc = doc_list[0]
    latest_doc['_id'] = str(latest_doc['_id'])
    return Response({'document': latest_doc})
