import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import Item from "./item"
import { Paper, Box } from "@material-ui/core"

function List({ todos, setTodos, classes }) {
  function handleOndragEnd(result) {
    const items = Array.from(todos)
    const [movedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, movedItem)
    setTodos(items)
    console.log(movedItem)
  }
  return (
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
                <Item
                  key={id}
                  todos={todos}
                  setTodos={setTodos}
                  id={id}
                  text={text}
                  completed={completed}
                  index={index}
                  classes={classes}
                ></Item>
              ))}
              {provided.placeholder}
            </Box>
          </Paper>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default List
