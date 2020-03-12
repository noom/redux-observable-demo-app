import { Observable, Observer } from "rxjs";
import { AjaxError, AjaxResponse } from "rxjs/ajax";

import {
  RequestStatus as RS,
  RequestType as RT,
  createRequest,
} from "@modules/common/requests";
import { UserStateItem, UsersState } from "@modules/users";
import { TodoStateItem, TodoState } from "@modules/todos";

const ajaxError = (status: number, message: string) =>
  ({
    status,
    responseType: "json",
    response: { message },
  } as AjaxError);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ajaxSuccess = (response: any) =>
  ({
    status: 200,
    responseType: "json",
    response,
  } as AjaxResponse);

export const repeatAjaxErrorsThenAjaxResult = (
  numberOfErrors: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response?: any
) => {
  let callCount = 0;
  return Observable.create(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (observer: Observer<any>) => {
      callCount += 1;
      if (callCount <= numberOfErrors) {
        observer.error(ajaxError(404, "Not Found"));
      } else {
        observer.next(ajaxSuccess(response));
        observer.complete();
      }
    }
  );
};

export const zeroState = {
  todos: {
    loading: {
      data: [] as number[],
      request: createRequest(undefined as unknown, RT.read, RS.success),
    },
    entities: {} as Record<number, TodoStateItem>,
  } as TodoState,
  users: {
    loading: {
      data: [] as number[],
      request: createRequest(undefined as unknown, RT.read, RS.success),
    },
    entities: {} as Record<number, UserStateItem>,
  } as UsersState,
};
