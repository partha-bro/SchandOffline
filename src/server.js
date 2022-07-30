require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const server = express()
server.set('view engine', 'ejs')
server.use(express.static('public'))
server.use(bodyParser.urlencoded({extended:true}))

server.route('/')
.get(
    (req,res)=>{
        res.render('Home', {title:'Home'})
    }
)

server.route('/create')
.get(
    (req,res)=>{
        res.render('Create', {title: 'Create'})
    }
)

// Server Listen to below port
server.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})