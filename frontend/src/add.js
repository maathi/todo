import { useState } from "react"
import { Paper, Box, TextField, Button, Icon } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
})

function Add({ todos, setTodos }) {
  const classes = useStyles()
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
