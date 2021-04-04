import { Draggable } from "react-beautiful-dnd"
import { makeStyles } from "@material-ui/core/styles"
import {
  Typography,
  Button,
  Icon,
  Box,
  Checkbox,
  TextField,
} from "@material-ui/core"

const useStyles = makeStyles({
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

function Item({ item, todos, setTodos, index }) {
  const classes = useStyles()

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

  //adding a due date
  function handleDateChange(e) {
    fetch(`http://localhost:3001/date`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        id: item.id,
        date: e.target.value,
      }),
    }).then(() => {
      const newTodos = [...todos]
      const modifiedTodoIndex = newTodos.findIndex(
        (todo) => todo.id === item.id
      )
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        date: e.target.value,
      }
      setTodos(newTodos)
    })
  }

  return (
    <Draggable draggableId={item.id} index={index}>
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
            checked={item.completed}
            onChange={() => toggleTodoCompleted(item.id)}
          ></Checkbox>
          <Box flexGrow={1}>
            <Typography
              className={item.completed ? classes.todoTextCompleted : ""}
              variant="body1"
            >
              {item.text}
            </Typography>
          </Box>

          <TextField
            className={!item.date ? classes.deleteTodo : ""}
            id="date"
            type="date"
            defaultValue={item.date}
            onChange={handleDateChange}
          />
          <Button
            className={classes.deleteTodo}
            startIcon={<Icon>delete</Icon>}
            onClick={() => deleteTodo(item.id)}
          >
            Delete
          </Button>
        </Box>
      )}
    </Draggable>
  )
}

export default Item
