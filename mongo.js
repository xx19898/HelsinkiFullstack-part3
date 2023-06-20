const mongoose = require('mongoose')
const process = require('process')

if(process.argv.length<2){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

console.log({password})

const url = `mongodb+srv://phonebookUser:${password}@cluster0.czyxxd4.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).then((x) => console.log('CONNECTED TO DB')).catch((e) => console.log('ERROR WHILE TRYING TO CONNECT TO THE DB'))

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    number: String
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