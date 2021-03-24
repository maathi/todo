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
  console.log(selectedPage)
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
  const { index, text } = req.body

  if (typeof text !== "string") {
    res.status(400)
    res.json({ message: "invalid 'text' expected string" })
    return
  }

  const todo = { id: generateId(), index, text, completed: false }
  await database.client.db("todos").collection("todos").insertOne(todo)
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
  await database.client.db("todos").collection("todos").deleteOne({ id })
  res.status(203)
  res.end()
})

app.post("/switch", async (req, res) => {
  const { srcIndex, dstIndex } = req.body
  console.log(typeof srcIndex, dstIndex)

  let { _id } = await database.client
    .db("todos")
    .collection("todos")
    .findOne({ index: srcIndex })

  await database.client
    .db("todos")
    .collection("todos")
    .findOneAndUpdate({ index: dstIndex }, { $set: { index: srcIndex } })

  await database.client
    .db("todos")
    .collection("todos")
    .findOneAndUpdate({ _id }, { $set: { index: dstIndex } })
  res.status(200)
  res.end()
})

module.exports = app
