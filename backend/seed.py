# backend/seed.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import random

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["grid_app"]
collection = db["rows"]

async def seed():
    await collection.delete_many({})  # Clear existing data
    rows = [
        {"name": f"Row {i+1}", "value": random.randint(1, 1000)}
        for i in range(500)
    ]
    await collection.insert_many(rows)
    print("✅ Inserted 500 rows.")

if __name__ == "__main__":
    asyncio.run(seed())
