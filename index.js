import 'dotenv/config'
import express from 'express'
import logger from "./logger.js";
import morgan from "morgan";


const app = express()
const port = 3000
app.use(express.json())

const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

let teaData = []
let nextId = 1

//Add a tea
app.post('/teas', (req, res) => {
    const { name, price } = req.body
    const newTea = { id: nextId++, name, price }
    teaData.push(newTea)
    res.status(201).send(newTea)
    
})

//Get all teas
app.get('/teas', (req, res) => {
  res.status(200).send(teaData)
})

//get one tea
app.get('/teas/:id', (req, res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id))
if (!tea) {
      return  res.status(400).send('Failed to find a single tea')
    }
    res.status(201).send(tea)
})

//update a tea
app.put('/teas/:id', (req, res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id))
    if (!tea) {
        res.status(400).send('Failed to find a single tea')
    }
    const { name, price } = req.body
    tea.name = name
    tea.price = price
    res.status(200).send(tea)
})

//delete a tea
app.delete('/teas/:id', (req, res) => {
    const index = teaData.findIndex(t=> t.id === parseInt(req.params.id))
    if (index === -1) {
        res.status(400).send('Failed to delete tea')
    }
    teaData.splice(index, 1)
    return res.status(200).send('successfully deleted tea')
})


app.listen(port, () => {
    console.log(`listening on port number ${port}...`)
})