/* eslint-disable no-console */
const express = require("express")
const { v4: generateId } = require("uuid")
const database = require("./database")

const app = express()

function requestLogger(req, res, next) {
  res.once("finish", () => {
    const log = [req.method, req.path]
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body))
    }
    log.push("->", res.statusCode)
    console.log(log.join(" "))
  })
  next()
}

app.use(requestLogger)
app.use(require("cors")())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  const pageSize = 20
  const selectedPage = Number(req.query.pageNumber) || 1
  const todos = database.client.db("todos").collection("todos")
  const response = await todos
    .find({})
    .sort({ index: 1 })
    .limit(pageSize)
    .skip(pageSize * (selectedPage - 1))
    .toArray()
  res.status(200)
  res.json(response)
})

app.post("/", async (req, res) => {
  const { text } = req.body

  if (typeof text !== "string") {
    res.status(400)
    res.json({ message: "invalid 'text' expected string" })
    return
  }

  const todo = { id: generateId(), index: 0, text, completed: false }

  const todos = database.client.db("todos").collection("todos")

  await todos.updateMany({}, { $inc: { index: 1 } })

  await todos.insertOne(todo)
  res.status(201)
  res.json(todo)
})

app.put("/:id", async (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  if (typeof completed !== "boolean") {
    res.status(400)
    res.json({ message: "invalid 'completed' expected boolean" })
    return
  }

  await database.client
    .db("todos")
    .collection("todos")
    .updateOne({ id }, { $set: { completed } })
  res.status(200)
  res.end()
})

app.delete("/:id", async (req, res) => {
  const { id } = req.params
  const { index } = req.body
  const todos = database.client.db("todos").collection("todos")
  await todos.deleteOne({ id })
  await todos.updateMany({ index: { $gt: index } }, { $inc: { index: -1 } })
  res.status(203)
  res.end()
})

app.post("/reorder", async (req, res) => {
  const { srcIndex, dstIndex } = req.body

  const todos = database.client.db("todos").collection("todos")
  let { id } = await todos.findOne({ index: srcIndex })

  //checks if we moved task from top to bottom or from bottom to top
  if (srcIndex < dstIndex) {
    await todos.updateMany(
      { index: { $gt: srcIndex, $lte: dstIndex } },
      { $inc: { index: -1 } }
    )
  } else {
    await todos.updateMany(
      { index: { $lt: srcIndex, $gte: dstIndex } },
      { $inc: { index: 1 } }
    )
  }
  await todos.updateOne({ id }, { $set: { index: dstIndex } })

  res.status(200)
  res.end()
})

app.post("/date", async (req, res) => {
  const { id, date } = req.body

  await database.client
    .db("todos")
    .collection("todos")
    .updateOne({ id }, { $set: { date } })
  res.status(200)
  res.end()
})
module.exports = app
