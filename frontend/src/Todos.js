import { useState, useEffect } from "react"
import { Container, Typography, Button } from "@material-ui/core"
import Add from "./add"
import List from "./list"

function Todos() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((todos) => setTodos(todos))
  }, [setTodos])

  //shows tasks due today
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
      <Add setTodos={setTodos} todos={todos}></Add>
      <Button
        style={{ color: "red", border: "1px solid red", marginTop: "5px" }}
        onClick={handleTodayClick}
      >
        Today's Tasks
      </Button>
      {(todos.length > 0 && (
        <List todos={todos} setTodos={setTodos}></List>
      )) || <h1>No Tasks</h1>}
    </Container>
  )
}

export default Todos
