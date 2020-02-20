import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import styled, { ThemeProvider } from "styled-components";

import {
  actions as todoActions,
  TodoItem,
  TodoList,
  TodoState,
} from "@modules/todos";

import { UserList, UsersState } from "@modules/users";

import {
  RequestState as RS,
  RequestType as RT,
  matchRequest,
} from "@modules/common/requests";

const theme = {
  color: {
    black: "#000",
  },
  layout: {
    width: 750,
  },
  spacing: 10,
};

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  color: ${props => props.theme.color.black};
`;

const AddButton = styled(Button)`
  margin-top: ${props => props.theme.spacing}px;
`;

const App: React.FC = () => {
  const [desc, setDesc] = useState("");
  const textRef = useRef<HTMLInputElement>();

  const { entities: todos, loading: todosLoading } = useSelector<
    AppState,
    TodoState
  >(state => state.todos);

  const { entities: users, loading: usersLoading } = useSelector<
    AppState,
    UsersState
  >(state => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(todoActions.loadTodos());
  }, [dispatch]);

  const addNewTodo = () => {
    dispatch(todoActions.addTodo({ text: desc }));
    setDesc("");
    return textRef.current?.focus();
  };

  const deleteTodo = (item: TodoItem) => {
    dispatch(todoActions.removeTodo(item));
  };

  const updateTodo = (item: TodoItem) => {
    dispatch(todoActions.updateTodo(item));
  };

  const onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
  };

  const onReset = () => {
    dispatch(todoActions.reset());
  };

  const onCancel = () => {
    dispatch(todoActions.loadTodosCancel());
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Paper style={{ padding: theme.spacing }}>
                  <TextField
                    multiline
                    autoFocus
                    inputRef={textRef}
                    placeholder="Enter todo message"
                    rows="5"
                    variant="outlined"
                    onChange={onDescChange}
                    value={desc}
                    fullWidth
                  />
                  <AddButton
                    disabled={!desc}
                    color="primary"
                    variant="contained"
                    onClick={addNewTodo}
                    fullWidth
                  >
                    Add Todo
                  </AddButton>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <div>
                  {matchRequest(RT.read, RS.inProgress)(todosLoading) && (
                    <Wrap>
                      <CircularProgress />
                    </Wrap>
                  )}

                  {matchRequest(RT.read, RS.error)(todosLoading) && (
                    <Typography color="error">Failed to load todos</Typography>
                  )}

                  {matchRequest(RT.read, RS.success)(todosLoading) && (
                    <>
                      <TodoList
                        items={todos}
                        onItemUpdate={updateTodo}
                        onItemDelete={deleteTodo}
                      />
                    </>
                  )}

                  <Wrap>
                    {matchRequest(RT.read, RS.inProgress)(todosLoading) ? (
                      <Button onClick={onCancel} color="secondary">
                        Cancel
                      </Button>
                    ) : (
                      <Button onClick={onReset} color="primary">
                        Reload
                      </Button>
                    )}
                  </Wrap>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            {matchRequest(RT.read, RS.inProgress)(usersLoading) && (
              <Wrap>
                <CircularProgress />
              </Wrap>
            )}
            {matchRequest(RT.read, RS.success)(usersLoading) && (
              <Wrap>
                <UserList items={users} />
              </Wrap>
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
