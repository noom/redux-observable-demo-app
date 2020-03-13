import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";

import { feedbackArray } from "@modules/common/operators";
import { StateEpic as SE } from "@modules/common/epics";

import {
  RequestStatus as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";

import Api from "../api";
import { slice, TodoState, TodoStateItem } from "../slice";

const { actions } = slice;

export const addTodoEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        Object.values(state.entities).filter(entity =>
          matchRequest(RT.create, RS.inProgress)(entity.request)
        ),
      entity =>
        Api.createTodo(entity.data).pipe(
          map(() => actions.addDone(entity.request.payload)),
          catchError(error => of(actions.addError(entity.data, error)))
        )
    )
  );
