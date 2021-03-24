import { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import {
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
} from "@material-ui/core"

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
  const [newTodoText, setNewTodoText] = useState("")

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((todos) => setTodos(todos))
  }, [setTodos])

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
      .then((todo) => setTodos([...todos, todo]))
    setNewTodoText("")
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos]
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id)
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      }
      setTodos(newTodos)
    })
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)))
  }

  function handleOndragEnd(result) {
    const items = Array.from(todos)
    const [movedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, movedItem)
    setTodos(items)
    console.log(movedItem)
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
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
      {todos.length > 0 && (
        <DragDropContext onDragEnd={handleOndragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <Paper
                className={classes.todosContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Box display="flex" flexDirection="column" alignItems="stretch">
                  {todos.map(({ id, text, completed }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <Box
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          className={classes.todoContainer}
                        >
                          <Checkbox
                            checked={completed}
                            onChange={() => toggleTodoCompleted(id)}
                          ></Checkbox>
                          <Box flexGrow={1}>
                            <Typography
                              className={
                                completed ? classes.todoTextCompleted : ""
                              }
                              variant="body1"
                            >
                              {text}
                            </Typography>
                          </Box>
                          <Button
                            className={classes.deleteTodo}
                            startIcon={<Icon>delete</Icon>}
                            onClick={() => deleteTodo(id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              </Paper>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Container>
  )
}

export default Todos
