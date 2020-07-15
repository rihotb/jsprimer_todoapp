import { render } from "./view/html-util.js";
import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListView } from "./view/TodoListView.js";

export class App {
  constructor() {
    this.todoListView = new TodoListView();
    this.todoListModel = new TodoListModel([]);
    this.formElement = null;
    this.inputElement = null;
  }

  handleAdd(title) {
    this.todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
  }

  handleUpdate({ id, completed }) {
    this.todoListModel.updateTodo({ id, completed });
  }

  handleDelete({ id }) {
    this.todoListModel.deleteTodo({ id });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.inputElement.value) {
      return;
    }
    this.handleAdd(this.inputElement.value);
    this.inputElement.value = "";
  };

  mount() {
    this.formElement = document.querySelector("#js-form");
    this.inputElement = document.querySelector("#js-form-input");
    const containerElement = document.querySelector("#js-todo-list");
    const todoItemCountElement = document.querySelector("#js-todo-count");

    this.todoListModel.onChange(() => {
      const todoItems = this.todoListModel.getTodoItems();
      const todoListElement = this.todoListView.createElement(todoItems, {
        onUpdateTodo: ({ id, completed }) => {
          this.handleUpdate({ id, completed });
        },
        onDeleteTodo: ({ id }) => {
          this.handleDelete({ id });
        },
      });
      render(todoListElement, containerElement);
      todoItemCountElement.textContent = `Todoアイテム数: ${this.todoListModel.getTotalCount()}`;
    });

    this.formElement.addEventListener("submit", this.handleSubmit);
  }

  unmount() {
    this.formElement.removeEventListener("submit", event);
  }
}
