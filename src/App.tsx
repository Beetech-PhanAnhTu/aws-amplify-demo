import { useEffect, useState } from "react";

import { generateClient } from "aws-amplify/api";

import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { type CreateTodoInput, ListTodosQuery, CreateTodoMutation, CreateTodoMutationVariables } from "./API";

import { withAuthenticator, Button, Heading } from "@aws-amplify/ui-react";
import { type AuthUser } from "aws-amplify/auth";
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import "@aws-amplify/ui-react/styles.css";
import { useMutation, useQuery } from "@apollo/client";

const initialState: CreateTodoInput = { name: "", description: "" };
const client = generateClient();

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
  user?: AuthUser;
};

const App: React.FC<AppProps> = ({ signOut, user }) => {
  const [formState, setFormState] = useState<CreateTodoInput>(initialState);
  const { data, loading, error } = useQuery<ListTodosQuery>(listTodos);
  const [addTodoMutation] = useMutation<CreateTodoMutation, CreateTodoMutationVariables>(createTodo);
  // const [isLoading, setIsLoading] = useState<boolean>(true);


  // useEffect(() => {
 
  // }, [data]);

  // async function fetchTodos() {
  //   setIsLoading(true);
  //   try {
  //     const todoData = await client.graphql({
  //       query: listTodos,
  //     });
  //     const todos = todoData.data.listTodos.items;
  //     setTodos(todos);
  //   } catch (err) {
  //     console.log("error fetching todos");
  //   }
  //   setIsLoading(false);
  // }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      console.log(formState);
      
      await addTodoMutation({
        variables: {
          input: formState, 
        },
        refetchQueries: [{query: listTodos}]
      });
      setFormState(initialState);
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  return (
    <div style={styles.container}>
      <Heading level={1}>Hello {user?.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
      <h2>Amplify Todos</h2>
      <input
        onChange={(event) =>
          setFormState({ ...formState, name: event.target.value })
        }
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) =>
          setFormState({ ...formState, description: event.target.value })
        }
        style={styles.input}
        value={formState.description as string}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {loading || error? (
      <p>Loading...</p>
      ) : (
        <>
          {data?.listTodos?.items.map((todo, index) => (
            <div key={index} style={styles.todo}>
              <p style={styles.todoName}>{todo?.name}</p>
              <p style={styles.todoDescription}>{todo?.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
} as const;

export default withAuthenticator(App);