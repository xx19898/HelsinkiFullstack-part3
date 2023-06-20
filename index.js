const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
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

let phonebook = [
  {
    id:1,
    name: 'Arto Hellas',
    number: '040-12356'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id:3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id:4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
]

app.get('/api/persons/:id', (req, res) => {
    const user = getEntryById(phonebook,parseInt(req.params.id))
    res.send(user)
})

app.get('/api/persons',(req,res) => {
  res.send(phonebook)
})

app.post('/api/persons',(req,res) => {
    if(req.body.name === undefined) res.status(400).send('<h1>Can\'t add entry as it does not have name property</h1>')
    else if(req.body.number === undefined) res.status(400).send('<h1>Can\'t add entry as it does not have number property</h1>')
    else if(nameAlreadyInPhonebook(req.body.name,phonebook)) res.status(400).send('<h1>Can\'t add entry as there is already an entry with same name</h1>')
    else{
        const newUserId = Math.floor((Math.random() * 100000 + 10000))
        const newUser = {...req.body,id:newUserId}
        newUser.id = newUserId
        phonebook.push(newUser)
        res.send(newUser)
    }
})

function nameAlreadyInPhonebook(name,phonebook){
    return phonebook.some((entry) => entry.name === name)
}

function getEntryById(list,id){
    return user = list.find((person) => person.id === id)
}

app.get('/info',(req,res) => {
    res.send(`
    <h1>Phonebook has info for ${phonebook.length} people </h1>
    <p>${new Date()}</p>`)
})

app.delete('/api/persons/:id',(req,res) => {
    deleteEntryById(phonebook,parseInt(req.params.id))
    res.send(phonebook)
})

function deleteEntryById(list,id){
    let newList = list.filter((entry) => entry.id != id)
    console.log({newList})
    phonebook = newList
}

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})