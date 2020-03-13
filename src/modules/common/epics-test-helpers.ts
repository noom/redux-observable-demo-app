import { Observable, Observer } from "rxjs";
import { AjaxError, AjaxResponse } from "rxjs/ajax";

import {
  RequestStatus as RS,
  RequestType as RT,
  createRequest,
} from "@modules/common/requests";
import { UserStateItem, UsersState } from "@modules/users";
import { TodoStateItem, TodoState } from "@modules/todos";

export const ajaxError = (status: number, message: string) =>
  ({
    status,
    responseType: "json",
    response: { message },
  } as AjaxError);

function instanceOfError(object: any): object is AjaxError {
  return object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ajaxSuccess = (response: any) =>
  ({
    status: 200,
    responseType: "json",
    response,
  } as AjaxResponse);

type MockedResponse = AjaxError | AjaxResponse;

export const mockAjaxStream = (responses: MockedResponse[]) => {
  let callCount = 0;
  return Observable.create(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (observer: Observer<any>) => {
      callCount += 1;
      if (responses[callCount - 1].status >= 400) {
        observer.error(responses[callCount - 1]);
      } else {
        observer.next(responses[callCount - 1]);
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
