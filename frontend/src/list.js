import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import InfiniteScroll from "react-infinite-scroll-component"
import { Paper, Box } from "@material-ui/core"
import Item from "./item"
import { useState } from "react"

function List({ todos, setTodos, classes }) {
  let pageSize = 20
  let [hasMore, setHasMore] = useState(true)

  function handleOndragEnd(result) {
    fetch("http://localhost:3001/switch", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        srcIndex: result.source.index,
        dstIndex: result.destination.index,
      }),
    })

    const items = Array.from(todos)
    const [movedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, movedItem)
    setTodos(items)
  }

  function fetchMoreData() {
    let pageNumber = Math.floor(todos.length / pageSize) + 1
    fetch("http://localhost:3001/?pageNumber=" + pageNumber)
      .then((response) => response.json())
      .then((moreTodos) => {
        console.log("lenth of more todos", moreTodos.length)
        if (moreTodos.length < pageSize) {
          console.log("yes")
          setHasMore(false)
        }
        setTodos(todos.concat(moreTodos))
      })
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
              <InfiniteScroll
                dataLength={todos.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
              >
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
              </InfiniteScroll>
              {provided.placeholder}
            </Box>
          </Paper>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default List
