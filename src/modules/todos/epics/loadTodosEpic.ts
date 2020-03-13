import { catchError, map, retry } from "rxjs/operators";
import { of } from "rxjs";

import { feedbackFlag } from "@modules/common/operators";
import { StateEpic as SE } from "@modules/common/epics";

import {
  RequestStatus as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";

import Api from "../api";
import { slice } from "../slice";

const { actions } = slice;

export const loadTodosEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackFlag(
      state => matchRequest(RT.read, RS.inProgress)(state.loading.request),
      () =>
        Api.listTodos().pipe(
          retry(3),
          map(request => actions.loadDone(request.response)),
          catchError(error => of(actions.loadError(error)))
        )
    )
  );
