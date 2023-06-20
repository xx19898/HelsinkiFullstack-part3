const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const { getAllEntries, getById, deleteById, createNewEntry } = require('./mongo')

morgan.token('post-body', function (req, res) {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  else{
    return ''
  }
})

const app = express()

app.use(cors())
app.use(express.static('build'))

morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['post-body'](req,res)
    ].join(' ')
  })

app.use(express.json())

app.get('/api/persons/:id',async (req, res) => {
    const user = await getById(parseInt(req.params.id))
    res.send(user)
})

app.get('/api/persons',async (req,res) => {
  const allEntries = await getAllEntries()
  console.log({allEntries})
  res.send(allEntries)
})

app.post('/api/persons',(req,res) => {
    if(req.body.name === undefined) res.status(400).send('<h1>Can\'t add entry as it does not have name property</h1>')
    else if(req.body.number === undefined) res.status(400).send('<h1>Can\'t add entry as it does not have number property</h1>')
    else{
        const newUser = {...req.body}
        createNewEntry(newUser)
        res.send(newUser)
    }
})



app.get('/info',(req,res) => {
    res.send(`
    <h1>Phonebook has info for ${phonebook.length} people </h1>
    <p>${new Date()}</p>`)
})

app.delete('/api/persons/:id',async (req,res) => {
    await deleteById(parseInt(req.params.id)).then((x) => {
      res.status(200).send(`Deleted entry with id of ${parseInt(req.params.id)}`)
    }).catch(e => {
      res.status(500).send(`Could not delete entry with id of ${parseInt(req.params.id)}`)
    })
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})