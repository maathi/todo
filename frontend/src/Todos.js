import { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Add from "./add"
import List from "./list"
import { Container, Typography } from "@material-ui/core"

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
})

function Todos() {
  const classes = useStyles()
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((todos) => setTodos(todos))
  }, [setTodos])

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Add setTodos={setTodos} todos={todos} classes={classes}></Add>
      {todos.length > 0 && (
        <List todos={todos} setTodos={setTodos} classes={classes}></List>
      )}
    </Container>
  )
}

export default Todos
