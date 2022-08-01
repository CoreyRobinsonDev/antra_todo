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
  }
}

// CONST
const state = new State();
const todoContainer = document.querySelector(".todo__container");
const formElement = document.querySelector(".form__container");
const defaultMsg = "<p>no active task</p>"

fetch("http://localhost:3000/todos")
  .then((res) => res.json())
  .then((json) => state.todos = json)




formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputElement = document.querySelector(".input");
  console.log(state)
})

