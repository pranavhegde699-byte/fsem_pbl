import os
from pathlib import Path
from dotenv import load_dotenv
import pymongo

load_dotenv(Path(__file__).resolve().parent / '.env')
uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
db_name = os.getenv('MONGO_DB_NAME', 'workproof')
client = pymongo.MongoClient(uri)
db = client[db_name]
scores = list(db['scores'].find())
print("Total scores in DB:", len(scores))
for s in scores:
    print({k: v for k, v in s.items() if k not in ['explanations', 'details']})
