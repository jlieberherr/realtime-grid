# Real-Time Data Grid App

A real-time collaborative data grid built with **FastAPI**, **MongoDB**, **React**, and **AG Grid**. Edits made by any user are instantly broadcast to all connected clients using WebSockets.

---

## 🚀 Features

- 🔄 **Real-Time Collaboration** — Updates are sent to all clients instantly.
- 🧮 **AG Grid Integration** — Powerful grid with editing, sorting, filtering, and more.
- 💾 **MongoDB Backend** — Rows are persisted in a MongoDB collection.
- 🌐 **FastAPI Server** — Modern Python backend with REST and WebSocket support.
- 🛠️ **Editable Table** — All rows are editable directly in the UI.
- 🔍 **Client-Side Filtering** — Filter any column using floating filters.

---

## ✅ Requirements

### Backend

- Python 3.10+
- MongoDB (local or remote)
- `pip`

### Frontend

- Node.js (v18+ recommended)
- npm (comes with Node.js)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/realtime-grid-app.git
cd realtime-grid-app
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Seed the database with sample data
```bash
python seed.py
```
This will insert 500 dummy rows into your MongoDB.

### 2. Set Up the Frontend

```bash
cd ../frontend
npm install
```

## ▶️ Run the App
### Start the Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Start the Frontend
```bash
cd frontend
npm start
```

- Frontend runs on: http://localhost:3000
- Backend API runs on: http://localhost:8000
