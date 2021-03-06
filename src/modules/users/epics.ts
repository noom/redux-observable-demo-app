import { catchError, map, retry } from "rxjs/operators";
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";

import { feedbackFlag } from "@modules/common/operators";
import { StateEpic as SE, combineStateEpics } from "@modules/common/epics";

import {
  RequestStatus as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";

import Api from "./api";

import { slice } from "./slice";

const { actions } = slice;

const loadEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.users),
    feedbackFlag(
      state => matchRequest(RT.read, RS.inProgress)(state.loading.request),
      () =>
        Api.listUsers().pipe(
          retry(3),
          map(request => actions.loadDone(request.response)),
          catchError(() => of(actions.loadError()))
        )
    )
  );

export default combineStateEpics(loadEpic);
