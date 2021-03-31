import { Draggable } from "react-beautiful-dnd"

import {
  Typography,
  Button,
  Icon,
  Box,
  Checkbox,
  TextField,
} from "@material-ui/core"

function Item({ todos, setTodos, id, text, index, completed, date, classes }) {
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
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        index,
      }),
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)))
  }

  function handleDateChange(e) {
    console.log(new Date().toISOString().split("T")[0])
    console.log(e.target.value)
    fetch(`http://localhost:3001/date`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id,
        date: e.target.value,
      }),
    }).then(() => {
      const newTodos = [...todos]
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id)
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        date: e.target.value,
      }
      setTodos(newTodos)
    })
  }

  return (
    <Draggable draggableId={id} index={index}>
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
              className={completed ? classes.todoTextCompleted : ""}
              variant="body1"
            >
              {text}
            </Typography>
          </Box>
          <TextField
            id="date"
            type="date"
            defaultValue={date}
            onChange={handleDateChange}
          />
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
  )
}

export default Item
