require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const SchandDB = require('../model/SchandOff') 
const { sumOfTotalSchandTotalApp,sumOfTotalLanPortal,sumOfTotalLicNo } = require('./Calculate')

const server = express()
server.set('view engine', 'ejs')
server.use(express.static('public'))
server.use(bodyParser.urlencoded({extended:true}))

server.route('/')
.get(
    (req,res)=>{
        SchandDB.find().limit(10).then(
            requests=>{
                const totalSchandTotal = sumOfTotalSchandTotalApp(requests)
                const totalLanPortal = sumOfTotalLanPortal(requests)
                const totalLicNo = sumOfTotalLicNo(requests)
                res.render('Home', {
                    title:'Home',
                    totalRequest: requests.length,
                    totalSchandTotal,
                    totalLanPortal,
                    totalLicNo,
                    requests
                    }
                )
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
        
    }
)

server.route('/edit/:id')
.get(
    (req,res)=>{
        const id = req.params.id
        SchandDB.findById(id).then(
            request=>{
                res.render('Edit', {title:'Edit',request})
            }
        ).catch(err=>console.log(`DB Edit Error: ${err}`))
    }
)
.post(
    (req,res)=>{
        const id = req.params.id
        SchandDB.findByIdAndUpdate(id,req.body).then(e=>{
            console.log(`Data Updated Successfully`)
            res.redirect('/')
        })
        .catch(err=>console.log(`Not updated!, Error: ${err}`))
    }
)

server.route('/create')
.get(
    (req,res)=>{
        res.render('Create', {title: 'Create'})
    }
)
.post(
    (req,res)=>{
        const newRequest = new SchandDB(req.body)
        newRequest.save().then(e=>{
            console.log(`Data Saved Successfully`)
            res.redirect('/')
        })
        .catch(err=>console.log(`Not Saved, Error: ${err}`))
    }
)

// Server Listen to below port
server.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})