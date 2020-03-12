import { combineReducers, Action } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";

// import modules
import { slice as todo, epics as todoEpics } from "@modules/todos";
import { slice as user, epics as userEpics } from "@modules/users";

const reducer = combineReducers({
  todos: todo.reducer,
  users: user.reducer,
});

type CombinedState = ReturnType<typeof reducer>;

// App store declared globally so it can be referenced anywhere
// without cycle imports
declare global {
  export type AppState = CombinedState;
}

export function createStore() {
  const logger = createLogger();
  // Set state type explicitly to avoid redux-observable TS bug
  const epicMiddleware = createEpicMiddleware<
    Action<unknown>,
    Action<unknown>,
    AppState
  >();

  // prettier-ignore
  const rootEpic = combineEpics(
    todoEpics,
    userEpics
  );

  const middleware = [...getDefaultMiddleware(), epicMiddleware];
  if (process.env.NODE_ENV === `development`) {
    middleware.push(logger);
  }

  const store = configureStore({
    reducer,
    middleware,
  });

  epicMiddleware.run(rootEpic);

  return store;
}
