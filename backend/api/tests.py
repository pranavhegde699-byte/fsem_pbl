import io
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from bson import ObjectId
import datetime

from .db import workers_collection, scores_collection, documents_collection
from .utils import generate_jwt

class UPIStatementValidationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Clean up collections
        workers_collection.delete_many({})
        scores_collection.delete_many({})
        documents_collection.delete_many({})
        
        # Create a mock worker
        self.worker = {
            'name': 'Test Worker',
            'phone': '9876543210',
            'aadhaar': '123456789012',
            'language': 'en',
            'latest_extracted_text': 'Existing text',
            'parsed_summary': {
                'total_inflow': 50000.0,
                'total_outflow': 35000.0,
                'avg_monthly_inflow': 50000.0,
                'months_analyzed': 1,
                'unique_senders': 5,
                'transaction_count': 20,
                'spending_ratio': 0.7,
                'consistency_score': 85.0,
                'monthly_breakdown': []
            }
        }
        result = workers_collection.insert_one(self.worker)
        self.worker_id = str(result.inserted_id)
        
        # Create historical score and document
        self.score = {
            'worker_id': self.worker_id,
            'total_score': 720,
            'grade': 'A',
            'created_at': datetime.datetime.utcnow()
        }
        scores_collection.insert_one(self.score)
        
        self.document = {
            'worker_id': self.worker_id,
            'file_url': 'data:application/pdf;base64,mock',
            'created_at': datetime.datetime.utcnow()
        }
        documents_collection.insert_one(self.document)
        
        # Generate token
        self.token = generate_jwt(self.worker_id)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_upload_invalid_pdf_wipes_previous_records_and_errors(self):
        # Create a mock invalid text PDF (just simple PDF header but no UPI keywords)
        invalid_pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"
        pdf_file = io.BytesIO(invalid_pdf_content)
        pdf_file.name = "invalid.pdf"
        
        response = self.client.post(
            '/api/uploads/upi-pdf',
            {'pdf': pdf_file},
            format='multipart'
        )
        
        # Assert response is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "upload the regular upi transaction id")
        
        # Assert database was cleaned up
        updated_worker = workers_collection.find_one({'_id': ObjectId(self.worker_id)})
        self.assertNotIn('parsed_summary', updated_worker)
        self.assertNotIn('latest_extracted_text', updated_worker)
        
        score_count = scores_collection.count_documents({'worker_id': self.worker_id})
        self.assertEqual(score_count, 0)
        
        doc_count = documents_collection.count_documents({'worker_id': self.worker_id})
        self.assertEqual(doc_count, 0)
