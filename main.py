from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()


# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# -------------------------
# Todo Model
# -------------------------

class Todo(BaseModel):
    title: str
    description: str
    priority: str


# -------------------------
# Temporary Storage
# -------------------------

todos = []


# -------------------------
# API Routes
# -------------------------

@app.get("/api")
def home():
    return {
        "message": "To Do API is running"
    }


# Create Todo
@app.post("/todos")
def create_todo(todo: Todo):

    new_todo = {
        "id": len(todos) + 1,
        "title": todo.title,
        "description": todo.description,
        "priority": todo.priority,
        "completed": False
    }

    todos.append(new_todo)

    return new_todo


# Get all Todos
@app.get("/todos")
def get_todos():

    return todos


# Get Todo by ID
@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):

    for todo in todos:

        if todo["id"] == todo_id:
            return todo

    return {
        "message": "Todo not found"
    }


# Update Todo
@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: Todo):

    for item in todos:

        if item["id"] == todo_id:

            item["title"] = todo.title
            item["description"] = todo.description
            item["priority"] = todo.priority

            return item

    return {
        "message": "Todo not found"
    }


# Complete Todo
@app.patch("/todos/{todo_id}/complete")
def complete_todo(todo_id: int):

    for todo in todos:

        if todo["id"] == todo_id:

            todo["completed"] = True

            return todo

    return {
        "message": "Todo not found"
    }


# Delete Todo
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):

    for todo in todos:

        if todo["id"] == todo_id:

            todos.remove(todo)

            return {
                "message": "Todo deleted successfully"
            }

    return {
        "message": "Todo not found"
    }


# -------------------------
# Frontend
# -------------------------

app.mount(
    "/",
    StaticFiles(directory="frontend", html=True),
    name="frontend"
)
