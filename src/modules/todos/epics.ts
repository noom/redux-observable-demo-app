import { catchError, map, retry } from "rxjs/operators";
import { of, Scheduler } from "rxjs";
import { ajax } from "rxjs/internal-compatibility";

import { feedbackArray, feedbackFlag } from "@modules/common/operators";
import { StateEpic as SE, combineStateEpics } from "@modules/common/epics";

import {
  RequestStatus as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";

import { Api } from "../../store";
import { slice, TodoState, TodoStateItem } from "./slice";

const { actions } = slice;

export const loadTodosEpic = (
  // These arguments allow for dependency injection during testing:
  getAjax: typeof ajax = ajax,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dueTime = 250,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scheduler: Scheduler | undefined = undefined
): SE<AppState> => state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackFlag(
      state => matchRequest(RT.read, RS.inProgress)(state.loading.request),
      () =>
        Api.todos
          .listTodos(getAjax)()
          .pipe(
            retry(3),
            map(request => actions.loadDone(request.response)),
            catchError(error => of(actions.loadError(error)))
          )
    )
  );

const updateTodoEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        Object.values(state.entities).filter(entity =>
          matchRequest(RT.update, RS.inProgress)(entity.request)
        ),
      entity =>
        Api.todos
          .updateTodo(ajax)(entity.data.id, entity.data)
          .pipe(
            retry(3),
            map(() => actions.updateDone(entity.request.payload)),
            catchError(error => of(actions.updateError(entity, error)))
          )
    )
  );

const addTodoEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        Object.values(state.entities).filter(entity =>
          matchRequest(RT.create, RS.inProgress)(entity.request)
        ),
      entity =>
        Api.todos
          .createTodo(ajax)(entity.data)
          .pipe(
            map(() => actions.addDone(entity.request.payload)),
            catchError(error => of(actions.addError(entity.data, error)))
          )
    )
  );

const removeTodoEpic: SE<AppState> = state$ =>
  state$.pipe(
    map(state => state.todos),
    feedbackArray<TodoState, TodoStateItem>(
      state =>
        Object.values(state.entities).filter(entity =>
          matchRequest(RT.delete, RS.inProgress)(entity.request)
        ),
      entity =>
        Api.todos
          .deleteTodo(ajax)(entity.data.id)
          .pipe(
            map(() => actions.removeDone(entity.data)),
            catchError(error => of(actions.removeError(entity.data, error)))
          )
    )
  );

export default combineStateEpics(
  loadTodosEpic(),
  updateTodoEpic,
  addTodoEpic,
  removeTodoEpic
);
