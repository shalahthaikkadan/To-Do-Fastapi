const API_URL = "/todos";

const state = {
    todos: [],
    filter: "all",
};

const $ = (id) => document.getElementById(id);

const els = {
    date: $("currentDate"),
    title: $("title"),
    description: $("description"),
    priority: $("priority"),
    list: $("todoList"),
    empty: $("emptyState"),
    total: $("totalTasks"),
    completed: $("completedTasks"),
    pending: $("pendingTasks"),
    progressBar: $("sideProgress"),
    progressText: $("progressText"),
};


// =========================
// API HELPER
// =========================

async function api(path = "", options = {}) {
    const response = await fetch(API_URL + path, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
    }

    // DELETE / PATCH may return no body
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}


// =========================
// HELPERS
// =========================

function escapeHTML(text = "") {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showDate() {
    els.date.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function getVisibleTodos() {
    switch (state.filter) {
        case "pending":   return state.todos.filter((t) => !t.completed);
        case "completed": return state.todos.filter((t) => t.completed);
        default:          return state.todos;
    }
}


// =========================
// RENDERING
// =========================

function todoTemplate(todo) {
    const done = todo.completed;
    const priority = String(todo.priority || "Medium");

    return `
        <div class="todo-card" data-id="${todo.id}">
            <div class="todo-left">
                <button class="check-button ${done ? "completed" : ""}"
                        data-action="complete">${done ? "✓" : ""}</button>

                <div class="todo-info">
                    <h3 class="${done ? "completed-title" : ""}">
                        ${escapeHTML(todo.title)}
                    </h3>
                    <p>${escapeHTML(todo.description)}</p>
                </div>
            </div>

            <div class="todo-right">
                <span class="priority priority-${escapeHTML(priority.toLowerCase())}">
                    ${escapeHTML(priority)}
                </span>
                <button class="delete-button" data-action="delete">Delete</button>
            </div>
        </div>
    `;
}

function renderTodos() {
    const visible = getVisibleTodos();

    els.list.innerHTML = visible.map(todoTemplate).join("");
    els.empty.style.display = visible.length ? "none" : "block";
}

function renderStatistics() {
    const total = state.todos.length;
    const completed = state.todos.filter((t) => t.completed).length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;

    els.total.textContent = total;
    els.completed.textContent = completed;
    els.pending.textContent = total - completed;
    els.progressBar.style.width = `${percentage}%`;
    els.progressText.textContent = `${percentage}% completed`;
}

function render() {
    renderStatistics();
    renderTodos();
}


// =========================
// ACTIONS
// =========================

async function loadTodos() {
    try {
        state.todos = await api();
        render();
    } catch (error) {
        console.error(error);
        alert("FastAPI server is not running.");
    }
}

async function addTodo() {
    const title = els.title.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    const todo = {
        title,
        description: els.description.value.trim() || "No description",
        priority: els.priority.value,
    };

    try {
        await api("", { method: "POST", body: JSON.stringify(todo) });

        els.title.value = "";
        els.description.value = "";
        els.priority.value = "Medium";

        await loadTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to connect to FastAPI backend.");
    }
}

async function completeTodo(id) {
    try {
        await api(`/${id}/complete`, { method: "PATCH" });
        await loadTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to complete task.");
    }
}

async function deleteTodo(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        await api(`/${id}`, { method: "DELETE" });
        await loadTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to delete task.");
    }
}

function filterTasks(filter, button) {
    state.filter = filter;

    document
        .querySelectorAll(".filter")
        .forEach((item) => item.classList.remove("active-filter"));

    button.classList.add("active-filter");

    renderTodos();
}


// =========================
// EVENTS (one listener for all cards)
// =========================

els.list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.closest(".todo-card").dataset.id);

    if (button.dataset.action === "complete") completeTodo(id);
    if (button.dataset.action === "delete") deleteTodo(id);
});

// Press Enter in the title field to add a task
els.title.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTodo();
});


// =========================
// START
// =========================

showDate();
loadTodos();