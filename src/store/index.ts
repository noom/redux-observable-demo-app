import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";

import {
  // TodoState,
  epics as todosEpics,
  reducer as todosReducer,
  initialState as todosInitialState
} from "../modules/todos";

import { TodoState } from "../modules/todos/reducer";

export interface AppState {
  todos: TodoState;
}

export const initialState: AppState = {
  todos: todosInitialState
};

export function createStore() {
  const reducer = combineReducers({
    todos: todosReducer
  });

  const logger = createLogger();
  const epicMiddleware = createEpicMiddleware();
  const rootEpic = combineEpics(todosEpics);

  const middleware = [...getDefaultMiddleware(), epicMiddleware, logger];

  const store = configureStore({
    reducer,
    middleware
  });

  epicMiddleware.run(rootEpic);

  return store;
}