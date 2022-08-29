require('dotenv').config()
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const url = process.env.MONGODB_URL
const database = 'schandOfflineDB'

mongoose.connect(url+database)
.then( e=>console.log(`MongoDB is connected with ${e.connection.host}`))
.catch( err=>console.log(`Database Error: ${err}`))

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String
        }
    }
)

userSchema.plugin(passportLocalMongoose)


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
schandOfflineSchema.index({"school.name": "text"})

const subjectSchema = new mongoose.Schema(
    {
        titles: String,
        classes: String,
        schandtotalEncStatus: String,
        lanEncStatus: String,
    }
)

const SchandDB = mongoose.model('request',schandOfflineSchema)
const User = mongoose.model('user',userSchema)
const Subject = mongoose.model('subject',subjectSchema)
module.exports = { SchandDB, User, Subject }