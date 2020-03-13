import { catchError, map, retry } from "rxjs/operators";
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

export const removeTodoEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        Object.values(state.entities).filter(entity =>
          matchRequest(RT.delete, RS.inProgress)(entity.request)
        ),
      entity =>
        Api.deleteTodo(entity.data.id).pipe(
          retry(2),
          map(() => actions.removeDone(entity.data)),
          catchError(error => of(actions.removeError(entity.data, error)))
        )
    )
  );
