require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
const database = 'schandOfflineDB'

mongoose.connect(url+database)
.then( e=>console.log(`MongoDB is connected with ${e.connection.host}`))
.catch( err=>console.log(`Database Error: ${err}`))

const salePersonSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        mobile: Number
    }
)
const schoolSchema = new mongoose.Schema(
    {
        name: String,
        state: String
    }
)


const schandOfflineSchema = new mongoose.Schema(
    {
        salePerson: salePersonSchema,
        createDate: String,
        school: schoolSchema,
        licNo: Number,
        buildType: String,
        status: String,
        titles: String
    }
)
schandOfflineSchema.index({"school.name": 'text'})

module.exports = mongoose.model('request',schandOfflineSchema)