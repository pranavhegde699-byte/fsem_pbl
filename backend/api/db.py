import pymongo
from django.conf import settings
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

_client = None
_db = None


def get_mongo_client():
    global _client
    if _client is None:
        _client = pymongo.MongoClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=5000,
        )
    return _client


def get_database():
    global _db
    if _db is None:
        import sys
        # Detect if we are running in Django test runner mode
        is_testing = 'test' in sys.argv or any('test' in arg for arg in sys.argv)
        db_name = settings.MONGO_DB_NAME + '_test' if is_testing else settings.MONGO_DB_NAME
        _db = get_mongo_client()[db_name]
    return _db


def ping_mongo():
    """Return (ok: bool, message: str)."""
    try:
        get_mongo_client().admin.command('ping')
        return True, 'connected'
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        return False, str(e)


# Collections used by the API
db = get_database()
workers_collection = db['workers']
scores_collection = db['scores']
schemes_collection = db['schemes']
documents_collection = db['documents']

_ok, _msg = ping_mongo()
if _ok:
    print(f"Successfully connected to MongoDB ({settings.MONGO_DB_NAME})")
else:
    print(f"Failed to connect to MongoDB: {_msg}")
