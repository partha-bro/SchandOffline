require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URL
const database = 'schandOfflineDB'

mongoose.connect(url+database)
.then( e=>console.log(`MongoDB is connected with ${e.connection.host}`))
.catch( err=>console.log(`Database Error: ${err}`))

const schandOfflineSchema = new mongoose.Schema(
    {
        requestNo: String,
        salePerson: String,
        email: String,
        mobile: Number,
        createDate: String,
        schoolName: String,
        licNo: Number,
        buildType: String,
        status: String,
        titles: Array
    }
)

module.exports = mongoose.model('request',schandOfflineSchema)