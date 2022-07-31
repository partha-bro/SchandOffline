require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const SchandDB = require('../model/SchandOff') 
const { totalRequestFun,sumOfTotalSchandTotalApp,sumOfTotalLanPortal,sumOfTotalLicNo } = require('./Calculate')

const server = express()
server.set('view engine', 'ejs')
server.use(express.static('public'))
server.use(bodyParser.urlencoded({extended:true}))

server.route('/')
.get(
    (req,res)=>{
        
        SchandDB.find().sort({createDate:-1}).limit(10).then(
            requests=>{

                SchandDB.find().then(
                    allRequests=>{
                        const totalRequest = totalRequestFun(allRequests)
                        const totalSchandTotal = sumOfTotalSchandTotalApp(allRequests)
                        const totalLanPortal = sumOfTotalLanPortal(allRequests)
                        const totalLicNo = sumOfTotalLicNo(allRequests)
                        res.render('Home', {
                            title:'Home',
                            totalRequest,
                            totalSchandTotal,
                            totalLanPortal,
                            totalLicNo,
                            requests
                            }
                        )
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
        SchandDB.findByIdAndUpdate(id,{
            salePerson: {
                name: req.body.salePerson,
                email: req.body.email,
                mobile: req.body.mobile
            },
            createDate: req.body.createDate,
            school: {
                name: req.body.schoolName,
                state: req.body.state
            },
            licNo: req.body.licNo,
            buildType: req.body.buildType,
            status: req.body.status,
            titles: req.body.titles
        }).then(e=>{
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

        const newRequest = new SchandDB(
            {
                salePerson: {
                    name: req.body.salePerson,
                    email: req.body.email,
                    mobile: req.body.mobile
                },
                createDate: req.body.createDate,
                school: {
                    name: req.body.schoolName,
                    state: req.body.state
                },
                licNo: req.body.licNo,
                buildType: req.body.buildType,
                status: req.body.status,
                titles: req.body.titles
            }
        )
        newRequest.save().then(e=>{
            console.log(`Data Saved Successfully`)
            res.redirect('/')
        })
        .catch(err=>console.log(`Not Saved, Error: ${err}`))
    }
)

server.route('/status/:status')
.get(
    (req,res) => {
        SchandDB.find({status:req.params.status}).then(
            requests=>{
                res.render('Status', {
                    title:'Status',
                    status: req.params.status,
                    requests
                    }
                )
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
    }
)

server.route('/salePerson')
.get(
    (req,res) => {
        SchandDB.find().then(
            requests=>{
                res.render('SalePerson/People', {
                    title:'Sale-Person Details',
                    requests
                    }
                )
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
    }
)
server.route('/salePerson/:id')
.get(
    (req,res) => {
        SchandDB.findById(req.params.id).then(
            request=>{
                res.render('SalePerson/PersonInfo', {
                    title:'Sale-Person Details',
                    request
                    }
                )
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
    }
)

server.route('/schools')
.get(
    (req,res) => {
        SchandDB.find().then(
            requests=>{
                res.render('School/Schools', {
                    title:'All School Details',
                    requests
                    }
                )
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
    }
)
server.route('/school/:id')
.get(
    (req,res) => {
        SchandDB.findById(req.params.id).then(
            request=>{
                res.render('School/SchoolInfo', {
                    title:'School Details',
                    request
                    }
                )
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
    }
)

// Server Listen to below port
server.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})