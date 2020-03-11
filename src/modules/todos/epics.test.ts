import { StateObservable } from "redux-observable";
import produce from "immer";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { marbles } from "rxjs-marbles/jest";

import {
  createRequest,
  RequestType as RT,
  RequestStatus as RS,
} from "@modules/common/requests";

import {
  zeroState,
  repeatAjaxErrorsThenAjaxResult,
} from "@modules/common/epics-test-helpers";

import { slice } from "./slice";
import { loadTodosEpic } from "./epics";
import { TodoItem } from "./models";

const mockTodoItems: TodoItem[] = [
  { id: 1, text: "Todo 1" },
  { id: 2, text: "Todo 2" },
];

jest.mock("rxjs/ajax", () => ({
  ajax: jest.fn(),
}));
const mockedAjax = (ajax as unknown) as jest.Mock<typeof ajax>;

describe("todo epics", () => {
  describe("todo epics", () => {
    it(
      "returns error if API fails four(4) times",
      marbles(m => {
        mockedAjax.mockImplementation(() => repeatAjaxErrorsThenAjaxResult(4));

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

        const actual$ = loadTodosEpic(
          (state$ as unknown) as StateObservable<AppState>
        );

        m.expect(actual$).toBeObservable(expected$);
      })
    );

    it(
      "can succeed after three(3) fails",
      marbles(m => {
        mockedAjax.mockImplementation(() =>
          repeatAjaxErrorsThenAjaxResult(3, mockTodoItems)
        );

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
        const actual$ = loadTodosEpic(
          (state$ as unknown) as StateObservable<AppState>
        );

        m.expect(actual$).toBeObservable(expected$);
      })
    );

    it(
      "produces loadDone action on success",
      marbles(m => {
        mockedAjax.mockImplementation(() =>
          repeatAjaxErrorsThenAjaxResult(0, mockTodoItems)
        );

        const states = {
          z: zeroState,
          s: produce(zeroState, draft => {
            draft.todos.loading.request = createRequest(
              undefined,
              RT.read,
              RS.inProgress
            );
          }),
        };
        const actions = {
          r: slice.actions.loadDone(mockTodoItems),
        };

        const state$ = m.cold<AppState>("  z-s--|", states);
        const expected$ = m.cold("  --r--|", actions);
        const actual$ = loadTodosEpic(
          (state$ as unknown) as StateObservable<AppState>
        );

        m.expect(actual$).toBeObservable(expected$);
      })
    );
  });
});
