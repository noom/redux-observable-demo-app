import { marbles } from "rxjs-marbles/jest";
import { StateObservable } from "redux-observable";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Observer, of, throwError, concat } from "rxjs";
import { ajax, AjaxCreationMethod } from "rxjs/internal-compatibility";
import produce from "immer";

import {
  createRequest,
  RequestType as RT,
  RequestStatus as RS,
} from "@modules/common/requests";

import { zeroState } from "@modules/common/epics-test-helpers";
import { slice } from "./slice";
import { loadTodosEpic } from "./epics";
import { TodoItem } from "./models";

const mockTodoItems: TodoItem[] = [{ id: 1, text: "T1" }];

jest.mock("rxjs/internal-compatibility", () => {
  // mock gets hoisted to the top so you cannot use external variables
  // mock doesn't respect module imports so you can mock.resetModules()
  const {
    repeatAjaxErrorsThenAjaxResult,
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, no-shadow
  } = require("@modules/common/epics-test-helpers");
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, no-shadow
  const { delay } = require("rxjs/operators");

  return {
    ajax: {
      get: jest
        .fn()
        .mockReturnValueOnce(repeatAjaxErrorsThenAjaxResult(4))
        .mockReturnValueOnce(
          repeatAjaxErrorsThenAjaxResult(3, [{ id: 1, text: "T1" }])
        )
        .mockReturnValue(
          of({ response: [{ id: 1, text: "T1" }] }).pipe(delay(1))
        ),
    },
  };
});

describe("todo epics", () => {
  describe("todo epics", () => {
    it(
      "returns error if API fails four(4) times",
      marbles(m => {
        const values = {
          z: zeroState,
          // using immer to create next state
          s: produce(zeroState, draft => {
            draft.todos.loading.request = createRequest(
              undefined,
              RT.read,
              RS.inProgress
            );
          }),
          // resulting action
          r: slice.actions.loadError({
            status: 404,
            responseType: "json",
            response: { message: `Not found 3` },
          }),
        };

        const state$ = m.cold("  z-s------|", values);
        const expected$ = m.cold("  --r------|", values);

        const testAjax = ajax as jest.Mocked<typeof ajax>;
        const epic = loadTodosEpic(testAjax as AjaxCreationMethod);
        const actual$ = epic((state$ as unknown) as StateObservable<AppState>);

        m.expect(actual$).toBeObservable(expected$);
      })
    );

    it(
      "can succeed after three(3) fails",
      marbles(m => {
        const values = {
          z: zeroState,
          // using immer to create next state
          s: produce(zeroState, draft => {
            draft.todos.loading.request = createRequest(
              undefined,
              RT.read,
              RS.inProgress
            );
          }),
          // resulting action
          r: slice.actions.loadDone(mockTodoItems),
        };

        const state$ = m.cold("  z-s------|", values);
        const expected$ = m.cold("  --r------|", values);

        const testAjax = ajax as jest.Mocked<typeof ajax>;
        const epic = loadTodosEpic(testAjax as AjaxCreationMethod);
        const actual$ = epic((state$ as unknown) as StateObservable<AppState>);

        m.expect(actual$).toBeObservable(expected$);
      })
    );

    it(
      "produces loadDone action on success",
      marbles(m => {
        const values = {
          z: zeroState,
          // using immer to create next state
          s: produce(zeroState, draft => {
            draft.todos.loading.request = createRequest(
              undefined,
              RT.read,
              RS.inProgress
            );
          }),
          // resulting action
          r: slice.actions.loadDone(mockTodoItems),
        };

        const state$ = m.cold("  z-s--|", values);
        const expected$ = m.cold("  ---r-|", values);

        const testAjax = ajax as jest.Mocked<typeof ajax>;
        const epic = loadTodosEpic(testAjax as AjaxCreationMethod);
        const actual$ = epic((state$ as unknown) as StateObservable<AppState>);

        m.expect(actual$).toBeObservable(expected$);
      })
    );
  });
});
