import { combineStateEpics } from "@modules/common/epics";

import { loadTodosEpic } from "./loadTodosEpic";
import { updateTodoEpic } from "./updateTodoEpic";
import { addTodoEpic } from "./addTodoEpic";
import { removeTodoEpic } from "./removeTodoEpic";

export default combineStateEpics(
  loadTodosEpic,
  updateTodoEpic,
  addTodoEpic,
  removeTodoEpic
);
