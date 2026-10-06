# TaskFlow – To-Do App (FastAPI)

A simple full-stack to-do application. The backend is built with **FastAPI** and serves a **vanilla HTML/CSS/JavaScript** frontend (TaskFlow dashboard) from the same server.

## Features

- Add tasks with a title, description and priority (Low / Medium / High)
- Mark tasks as completed
- Delete tasks
- Filter tasks: All / Pending / Completed
- Live statistics: total, pending and completed tasks
- Daily progress bar in the sidebar
- Interactive API docs (Swagger UI) provided by FastAPI

## Tech Stack

- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **Frontend:** HTML, CSS, JavaScript (no framework)
- **Storage:** In-memory list (temporary)

## Project Structure

```
To-Do-Fastapi/
├── main.py            # FastAPI app and API routes
├── frontend/
│   ├── index.html     # TaskFlow UI
│   ├── style.css      # Styling
│   └── script.js      # Frontend logic (fetch calls to the API)
└── .gitignore
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shalahthaikkadan/To-Do-Fastapi.git
cd To-Do-Fastapi
```

### 2. Create and activate a virtual environment (optional but recommended)

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn
```

### 4. Run the server

```bash
uvicorn main:app --reload
```

### 5. Open the app

- App (frontend): http://127.0.0.1:8000
- API health check: http://127.0.0.1:8000/api
- Swagger docs: http://127.0.0.1:8000/docs

> Run the command from the project root so the `frontend` folder is found.

## API Endpoints

| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api`                    | API status message   |
| POST   | `/todos`                  | Create a new todo    |
| GET    | `/todos`                  | Get all todos        |
| GET    | `/todos/{todo_id}`        | Get a todo by ID     |
| PUT    | `/todos/{todo_id}`        | Update a todo        |
| PATCH  | `/todos/{todo_id}/complete` | Mark a todo as completed |
| DELETE | `/todos/{todo_id}`        | Delete a todo        |

### Request body (POST / PUT)

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs and bread",
  "priority": "High"
}
```

### Example response

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs and bread",
  "priority": "High",
  "completed": false
}
```

## Notes

- Todos are stored in memory, so **all data is lost when the server restarts**.
- CORS is open to all origins (`*`), which is fine for development but should be restricted in production.

## Future Improvements

- Persistent database (SQLite / PostgreSQL)
- Edit tasks from the UI
- User authentication
- Proper 404 responses for missing todos

## License

This project is open source. Add a license of your choice (e.g., MIT).
