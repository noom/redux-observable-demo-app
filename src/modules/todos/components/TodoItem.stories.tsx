import React from "react";
import { action } from "@storybook/addon-actions";
import { withKnobs, select } from "@storybook/addon-knobs";

import { TodoItem as TodoModel, createTodo } from "@modules/todos/models";
import { Request, RequestType, RequestState } from "@modules/common/requests";

import { List } from "@material-ui/core";

import TodoItem from "./TodoItem";

export default {
  title: "TodoItem",
  component: TodoItem,
  decorators: [withKnobs],
};

const request: Request<TodoModel> = {
  type: RequestType.read,
  state: RequestState.success,
  payload: {
    text: "Hello World Todo Item",
    id: 0.23123123123312,
    completed: true,
  },
};

export const withText = () => (
  <List>
    <TodoItem
      onCheckBoxToggle={action("checked")}
      item={{
        data: {
          id: 0.3456,
          text: "Hello World Todo Item",
        },
        request,
      }}
    />
  </List>
);

export const withEmoji = () => (
  <List>
    <TodoItem
      item={{
        data: {
          id: 0.87654321,
          text: "😀 😎 👍 💯",
        },
        request,
      }}
    />
  </List>
);

export const withRequest = () => {
  const typeSelectKnob = select(
    "Request Type",
    {
      Create: RequestType.create,
      Delete: RequestType.delete,
      Read: RequestType.read,
      Update: RequestType.update,
    },
    RequestType.create
  );

  const stateSelectKnob = select(
    "Request State",
    {
      InProgress: RequestState.inProgress,
      Success: RequestState.success,
      Error: RequestState.error,
    },
    RequestState.inProgress
  );

  const item = createTodo({ text: "Change knob values" });

  return (
    <List>
      <TodoItem
        onCheckBoxToggle={action("checked")}
        item={{
          data: item,
          request: {
            type: typeSelectKnob,
            state: stateSelectKnob,
            payload: item,
          },
        }}
      />
    </List>
  );
};
