import { DragDropContext, Droppable } from "react-beautiful-dnd"
import InfiniteScroll from "react-infinite-scroll-component"
import { Paper, Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useState } from "react"

import Item from "./item"

const useStyles = makeStyles({
  todosContainer: { marginTop: 10, padding: 10 },
})

function List({ todos, setTodos }) {
  const pageSize = 20
  const classes = useStyles()
  let [hasMore, setHasMore] = useState(true)

  //handles sorting tasks
  function handleOndragEnd(result) {
    let srcIndex = result.source.index
    let dstIndex = result.destination.index

    fetch("http://localhost:3001/reorder", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        srcIndex,
        dstIndex,
      }),
    })

    //sorting tasks on client
    const items = Array.from(todos)
    const [movedItem] = items.splice(srcIndex, 1)
    items.splice(dstIndex, 0, movedItem)

    //reseting indexes
    items.map((x, i) => (x.index = i))
    setTodos(items)
  }

  //fetch 20 more tasks
  function fetchMoreData() {
    let pageNumber = Math.floor(todos.length / pageSize) + 1
    fetch("http://localhost:3001/?pageNumber=" + pageNumber)
      .then((response) => response.json())
      .then((moreTodos) => {
        if (moreTodos.length < pageSize) {
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
                {todos.map(({ id, text, completed, date }, index) => (
                  <Item
                    key={id}
                    item={{
                      id,
                      text,
                      completed,
                      date,
                    }}
                    todos={todos}
                    setTodos={setTodos}
                    index={index}
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
