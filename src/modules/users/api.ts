import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";

import { User } from "./models";

const { REACT_APP_SERVER_URL: SERVER_URL } = process.env;

const getUser = (id: User["id"]): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/users/${id}`,
    method: "GET",
  });
};

const listUsers = (): Observable<AjaxResponse> => {
  return ajax({
    url: `${SERVER_URL}/users`,
    method: "GET",
  });
};

export default {
  getUser,
  listUsers,
};
