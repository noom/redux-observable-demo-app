import { Observable } from "rxjs";
import { AjaxCreationMethod, AjaxResponse } from "rxjs/internal-compatibility";

import { TodoItem } from "./models";

const { REACT_APP_SERVER_URL: SERVER_URL } = process.env;

const getTodo = (ajax: AjaxCreationMethod) => (
  id: TodoItem["id"]
): Observable<AjaxResponse> => {
  return ajax.get(`${SERVER_URL}/todos/${id}`);
};

const listTodos = (ajax: AjaxCreationMethod) => (): Observable<
  AjaxResponse
> => {
  return ajax.get(`${SERVER_URL}/todos`);
};

const createTodo = (ajax: AjaxCreationMethod) => (
  data: TodoItem
): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/todos`,
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const updateTodo = (ajax: AjaxCreationMethod) => (
  id: TodoItem["id"],
  data: TodoItem
): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/todos/${id}`,
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const deleteTodo = (ajax: AjaxCreationMethod) => (
  id: TodoItem["id"]
): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/todos/${id}`,
    method: "DELETE",
  });
};

export default {
  listTodos,
  createTodo,
  deleteTodo,
  getTodo,
  updateTodo,
};
