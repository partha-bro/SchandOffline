require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

// database import
const SchandDB = require('../model/SchandOff')
// some method import from calculate 
const { totalRequestFun,sumOfTotalSchandTotalApp,sumOfTotalLanPortal,sumOfAppLicNo,sumOfLanLicNo } = require('./Calculate')

const server = express()
server.set('view engine', 'ejs')
server.use(express.static('public'))
server.use(bodyParser.urlencoded({extended:true}))

// Home route
server.route('/')
.get(
    (req,res)=>{
        // select all data with decending order of createDate
        SchandDB.find().sort({createDate:-1}).limit().then(
            requests=>{

                SchandDB.find().then(
                    allRequests=>{
                        const totalRequest = totalRequestFun(allRequests)
                        const totalSchandTotal = sumOfTotalSchandTotalApp(allRequests)
                        const totalLanPortal = sumOfTotalLanPortal(allRequests)
                        // const totalLicNo = sumOfTotalLicNo(allRequests)
                        const totalAppLicNo = sumOfAppLicNo(allRequests)
                        const totalLanLicNo = sumOfLanLicNo(allRequests)
                        res.render('Home', {
                            title:'Home',
                            totalRequest,
                            totalSchandTotal,
                            totalLanPortal,
                            totalAppLicNo,
                            totalLanLicNo,
                            requests
                            }
                        )
                    }
                )
                
            }
        ).catch(err=>console.log(`DB Read Error: ${err}`))
        
    }
)

// website input Form route
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

// edit route
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



// pending or complete statue route
server.route('/status/:status')
.get(
    (req,res) => {
        SchandDB.find({status:req.params.status}).sort({createDate:-1}).then(
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

// all sales person display
server.route('/salePerson')
.get(
    (req,res) => {
        SchandDB.find().sort({salePerson:1}).then(
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
// single sales person display
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

//All school details
server.route('/schools')
.get(
    (req,res) => {
        SchandDB.find().sort({school:1}).then(
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
// Single school details
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

// search route for school
server.route('/search')
.post(
    (req,res) => {
        SchandDB.find({ $text : { $search : req.body.search } }).then(
            requests=>{
                res.render('School/Schools', {
                    title: 'Search Information',
                    requests
                    }
                )
            }
        ).catch(err=>console.log(`DB Search Error: ${err}`))
    }
)

// handle wrong url hit in browser
server.get('*',(req,res)=>{
    res.redirect('/')
})

// Server Listen to below port
server.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})