// STATE
class State {
  constructor() {
    this._todos = [];
  }

  get todos() {
    return this._todos; 
  }

  set todos(newTodo) {
    this._todos = newTodo;
    renderTodos();
    const todoItems = document.querySelectorAll(".todo__item");
    const editBtns = document.querySelectorAll(".edit__btn");
    const deleteBtns = document.querySelectorAll(".delete__btn");
    editBtns.forEach(btn => btn.addEventListener("click", editTodo))
    deleteBtns.forEach(btn => btn.addEventListener("click", deleteTodo))
    todoItems.forEach(todo => todo.addEventListener("click", completeTodo))
    console.log(this)
  }
}

// CONST
const state = new State();
const todoContainer = document.querySelector(".todo__container");
const formElement = document.querySelector(".form__container");
const baseURL = "http://localhost:3000"
const defaultMsg = "<p>no active task</p>"

fetch(`${baseURL}/todos`)
  .then((res) => res.json())
  .then((json) => state.todos = json)


function generateTodoTemplate({ id, title, completed }) {
  const editSVG = `<svg class="edit__btn" name="${id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`;
  const deleteSVG = `<svg class="delete__btn" name="${id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;

  return `<section id=${id} class="todo__item--section">
  <p class='todo__item ${completed ? "--completed" : ""}' name='${id}'>${title}</p>
  <div>
  ${editSVG}
 ${deleteSVG}
 </div>
  </section>`
}

function renderTodos() {
  if (state.todos.length === 0) todoContainer.innerHTML = defaultMsg;
  const todoTemplates  = state.todos.map((todo) => generateTodoTemplate(todo))
  todoContainer.innerHTML = todoTemplates.join("");
}

function onSubmit(event) {
  event.preventDefault();
  const inputElement = document.querySelector(".input");
  const todo = inputElement.value;

  fetch(`${baseURL}/todos`, {
    method: "POST",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
    body: JSON.stringify({ title: todo, completed: false })
  })
}

function completeTodo(event) {
  event.preventDefault();
  const completedTag = event.target.className.split(" ")[1];
  const isCompleted = completedTag ? true : false;
  const id = +event.target.getAttribute("name");
  
  if (isCompleted) {
    fetch(`${baseURL}/todos/${id}`, {
    method: "PATCH",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({completed: false})
    })
  } else {
    fetch(`${baseURL}/todos/${id}`, {
    method: "PATCH",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({completed: true})
    })

  }
  
}

function editTodo(event) {
  event.preventDefault();
  const id = event.target.getAttribute("name")
  const todoContainer = document.getElementById(id);
  const form = document.createElement("form");
  const todo = todoContainer.childNodes[1];
  const input = `<input class="input--edit" type="text" name="todo" value="${todo.innerText} "/>`;
  form.addEventListener("submit", submitEdit);
  form.innerHTML = input

  todoContainer.insertBefore(form, todo);
  todo.remove();

  function submitEdit() {
    const newTodo = document.querySelector(".input--edit").value;

    fetch(`${baseURL}/todos/${id}`, {
      method: "PUT",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({title: newTodo, completed: false})
    })

  }
}


function deleteTodo(event) {
  event.preventDefault();
  const id = event.target.getAttribute("name");
  fetch(`${baseURL}/todos/${id}`, {method: "DELETE"})
}

formElement.addEventListener("submit", onSubmit)

