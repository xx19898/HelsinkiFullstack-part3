const mongoose = require('mongoose')
const process = require('process')
require('dotenv').config()

const password = process.env.dbPassword
console.log({password})
const url = `mongodb+srv://phonebookUser:${password}@cluster0.czyxxd4.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).then((x) => console.log('CONNECTED TO DB')).catch((e) => console.log('ERROR WHILE TRYING TO CONNECT TO THE DB'))

const phonebookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength:3,
    required:true
  },
  number: {
    type:String,
    required: true,
    validate:{
      validator: function(v){
        const numberPartsDividedByMinus = v.split('-')
        if(numberPartsDividedByMinus.length != 2) throw new Error('Number of the person you wish to add to the phonebook is formatted in wrong way :/ . It should consist of two parts divided by \'-\' and be at least 8 characters long')
        numberPartsDividedByMinus.forEach((part) => {
          const partIsLegitNumber = /^\d+$/.test(part)
          if(!partIsLegitNumber) throw new Error('The number you chose contains faulty characters. It should consist of numbers.')
        })
        const firstPartLength = numberPartsDividedByMinus[0].length
        if(firstPartLength != 2 && firstPartLength != 3) throw new Error('First part of the number must contain 2 or 3 digits')
        const secondPartLength = numberPartsDividedByMinus[1].length
        if(firstPartLength + secondPartLength < 8) throw new Error('Number is too short. It should contain at least 8 numbers')
      }
    }
  }
})

console.log({serverstatus:mongoose.connection.readyState})

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema)

async function createNewEntry(newEntry){
  console.log({SavingNewEntry: newEntry})
  const entryToCreate = new PhonebookEntry({
    name:newEntry.name,
    number: newEntry.number
  })
  await entryToCreate.save().then(result => {
    console.log('new entry saved!')
  })
}

async function getAllEntries(){
  const allEntries = await PhonebookEntry.find({}).exec()
  return allEntries
}

async function getById(id){
  console.log({id:id})
  const entry = await PhonebookEntry.findOne({'_id':id}).exec()
  console.log({entry:entry})
  return entry 
}

async function getCountOfAllEntries(){
  const count = await PhonebookEntry.count()
  return count
}

async function deleteById(id){
  const entry = await PhonebookEntry.deleteOne({'_id':id}).exec()
}

module.exports = {getAllEntries,getById,deleteById,createNewEntry,getCountOfAllEntries}