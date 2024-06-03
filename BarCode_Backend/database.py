import pymongo

mongo_URI = "mongodb://localhost:27017"
client = pymongo.MongoClient("mongodb://localhost:27017")

print("database_client",client)

db = client["bar_code_generate"]
clone_bar_data = db["clone_bar_data"]
series_bar_data = db["series_bar_data"]

