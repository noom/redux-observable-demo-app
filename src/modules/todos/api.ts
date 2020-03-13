import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";

import { TodoItem } from "./models";

const { REACT_APP_SERVER_URL: SERVER_URL } = process.env;

const getTodo = (id: TodoItem["id"]): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/todos/${id}`,
    method: "GET",
  });
};

const listTodos = (): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/todos`,
    method: "GET",
  });
};

const createTodo = (data: TodoItem): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/todos`,
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const updateTodo = (
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

const deleteTodo = (id: TodoItem["id"]): Observable<AjaxResponse> => {
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
