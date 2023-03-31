require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))





let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.get('/', (request, response) => {
  console.log('test')
  response.send('<h1>Hello World!</h1>')

})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})


app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(rs)
    } else {
      response.status(404).end()
    }

  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const newNote = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, newNote, { new: true }).then(rs => {
    response.json(rs)
  }).catch(ex => next(ex))
})

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id).then(rs => {
    response.status(204).end()
  }).catch(er => next(er))
})

app.post('/api/notes', (request, response) => {

  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })

})

const PORT = process.env.PORT



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: `ID is in wrong format`
    })
  }

  next(error)
}
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
