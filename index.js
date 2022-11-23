require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

const getRandomNumber = (range) => {
  const number =  Math.floor(Math.random() * range)

  if(entries.find(entry => entry.id === number)) {
    return getRandomNumber(range)
  } else {
    return number
  }
}

app.get('/info', (req, res) => {

  const date = new Date()
  res.send(
    `<div>
      <p>Phonebook has information for ${entries.length} people</p>
      <p>${date.toLocaleString('en-US')}</p>
    </div>`
  )
})

app.get('/api/entries', (req, res) => {
  Entry.find({}).then(entries => res.json(entries))
})

app.get('/api/entries/:id', (req, res) => {
  const id = Number(req.params.id)
  const entry = entries.find(entry => entry.id === id)

  if(entry) {
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/entries/:id', (req, res) => {
  const id = Number(req.params.id)

  if(entries.find(entry => entry.id === id)) {
    entries = entries.filter(entry => entry.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
 
})

app.post('/api/entries', (req, res) => {
  const body = req.body

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'Content missing'
    })
  }

  // if(entries.find(entry => entry.name === body.name)) {
  //   return res.status(400).json({
  //     error: 'Name must be unique'
  //   })
  // }

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })

  entry.save().then(result => res.json(result))
  

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})