import json

from bson import ObjectId
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from database import collection
from models import Row

app = FastAPI()

# CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

clients = []


@app.get("/rows")
async def get_rows():
    rows = []
    async for row in collection.find():
        row["id"] = str(row["_id"])
        del row["_id"]
        rows.append(row)
    return rows


@app.post("/rows")
async def update_row(row: Row):
    if row.id:
        await collection.update_one(
            {"_id": ObjectId(row.id)},
            {"$set": {"name": row.name, "value": row.value}}
        )
    else:
        result = await collection.insert_one(row.dict(exclude={"id"}))
        row.id = str(result.inserted_id)
    await broadcast_change(row)
    return row


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        clients.remove(websocket)


async def broadcast_change(row: Row):
    data = json.dumps(row.dict())
    for client in clients:
        try:
            await client.send_text(data)
        except:
            clients.remove(client)
