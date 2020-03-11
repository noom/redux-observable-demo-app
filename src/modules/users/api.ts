import { Observable } from "rxjs";
import { AjaxCreationMethod, AjaxResponse } from "rxjs/internal-compatibility";

import { User } from "./models";

const { REACT_APP_SERVER_URL: SERVER_URL } = process.env;

const getUser = (ajax: AjaxCreationMethod) => (
  id: User["id"]
): Observable<AjaxResponse> => {
  return ajax.get(`${SERVER_URL}/users/${id}`);
};

const listUsers = (ajax: AjaxCreationMethod) => (): Observable<
  AjaxResponse
> => {
  return ajax.get(`${SERVER_URL}/users`);
};

export default {
  getUser,
  listUsers,
};
