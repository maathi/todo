import { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Add from "./add"
import List from "./list"
import { Container, Typography, Button } from "@material-ui/core"

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

  function handleTodayClick() {
    let todays = todos.filter(
      (t) => t.date === new Date().toISOString().split("T")[0]
    )
    setTodos(todays)
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Add setTodos={setTodos} todos={todos} classes={classes}></Add>
      <Button
        style={{ color: "red", border: "1px solid red", marginTop: "5px" }}
        onClick={handleTodayClick}
      >
        Today's Tasks
      </Button>
      {(todos.length > 0 && (
        <List todos={todos} setTodos={setTodos} classes={classes}></List>
      )) || <h1>No Tasks</h1>}
    </Container>
  )
}

export default Todos
