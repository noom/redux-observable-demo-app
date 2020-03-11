import { Observable, Observer } from "rxjs";
import { AjaxError, AjaxResponse } from "rxjs/internal-compatibility";

import {
  RequestStatus as RS,
  RequestType as RT,
  createRequest,
} from "@modules/common/requests";
import { UserStateItem, UsersState } from "@modules/users";
import { TodoStateItem, TodoState } from "@modules/todos";

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
        observer.error({
          status: 404,
          responseType: "json",
          response: { message: `Not found ${callCount - 1}` },
        } as AjaxError);
      } else {
        observer.next({
          status: 200,
          responseType: "json",
          response,
        } as AjaxResponse);
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
