import { useState } from "react"
import { Paper, Box, TextField, Button, Icon } from "@material-ui/core"

function Add({ todos, setTodos, classes }) {
  const [newTodoText, setNewTodoText] = useState("")
  function addTodo(text) {
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([todo, ...todos]))
    setNewTodoText("")
  }

  return (
    <Paper className={classes.addTodoContainer}>
      <Box display="flex" flexDirection="row">
        <Box flexGrow={1}>
          <TextField
            fullWidth
            value={newTodoText}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                addTodo(newTodoText)
              }
            }}
            onChange={(event) => setNewTodoText(event.target.value)}
          />
        </Box>
        <Button
          className={classes.addTodoButton}
          startIcon={<Icon>add</Icon>}
          onClick={() => addTodo(newTodoText)}
        >
          Add
        </Button>
      </Box>
    </Paper>
  )
}

export default Add
