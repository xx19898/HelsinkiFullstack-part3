const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const { getAllEntries, getById, deleteById, createNewEntry, getCountOfAllEntries } = require('./mongo')


const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('post-body', function (req, res) {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  else{
    return ''
  }
})
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

  const errorHandler = (error,request,response,next) => {
    console.error('GOT TO ERROR HANDLER')
    console.log({errorName:error.name})
    if(error.name === 'CastError'){
      return response.status(400).send({error:'malformatted id'})
    }else if(error.name === 'Error'){
      return response.status(400).send({error:error.message})
    }
    next()
  }
  
  const unknownEndpoint = (request, response) => {
    console.log('unknown endpoint')
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.get('/api/persons/:id',async (req, res,next) => {
    await getById(req.params.id).then(user =>  res.send(user)).catch(e => next(new Error(`Could not find user with id ${req.params.id}`)))
})
  app.get('/api/persons',async (req,res) => {
    const allEntries = await getAllEntries()
    console.log({allEntries})
    res.send(allEntries)
  })

  app.post('/api/persons',(req,res,next) => {
      console.log({data:req.body})
      if(req.body.name == undefined || req.body.number == undefined || req.body.name.length === 0 || req.body.number.length === 0) next(new Error('Malformed request. Form missin either name or number'))
      else{
          const newUser = {...req.body}
          createNewEntry(newUser)
          res.send(newUser)
      }
  })

  app.get('/info',async (req,res,next) => {
    const count = await getCountOfAllEntries().catch(e => next(e))
    res.send(`
    <h1>Phonebook has info for ${count} people </h1>
    <p>${new Date()}</p>`)
})
  app.delete('/api/persons/:id',async (req,res,next) => {
      await deleteById(req.params.id).then((x) => {
        res.status(200).send(`Deleted entry with id of ${parseInt(req.params.id)}`)
      }).catch(e => {
        next(new Error(`Could not delete entry with id of ${req.params.id}`))
      })
  })  

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  app.use(errorHandler)
  app.use(unknownEndpoint)