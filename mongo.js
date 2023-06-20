const mongoose = require('mongoose')
const process = require('process')

if(process.argv.length<2){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

console.log({password})

const url = `mongodb+srv://phonebookUser:${password}@cluster0.czyxxd4.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url).then((x) => console.log('CONNECTED TO DB')).catch((e) => console.log('ERROR WHILE TRYING TO CONNECT TO THE DB'))

const phonebookEntrySchema = new mongoose.Schema({
    name: String,
    number: Number
})

console.log({serverstatus:mongoose.connection.readyState})

const PhonebookEntry = mongoose.model('Note', phonebookEntrySchema)

 async function createNewEntry(newEntry){
    console.log({SavingNewEntry: newEntry})
    const entryToCreate = new PhonebookEntry({
        name:newEntry.name,
        number: newEntry.number
    })
    await entryToCreate.save().then(result => {
        console.log('new entry saved!')
        mongoose.connection.close()
        console.log('closed connection')
    })
}

 async function getAllEntries(){
    const allEntries = await PhonebookEntry.find({}).exec()
    return allEntries
}

 async function getById(id){
    const entry = await PhonebookEntry.findById(id).exec()
    return entry 
}

async function deleteById(id){
    const entry = await PhonebookEntry.deleteOne({id:id}).exec()
}

module.exports = {getAllEntries,getById,deleteById,createNewEntry}