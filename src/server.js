require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const fs = require('fs')
const { Parser } = require('json2csv')

// database import
const { SchandDB, User } = require('../model/SchandOff')
// some method import from calculate 
const { totalRequestFun,sumOfTotalSchandTotalApp,sumOfTotalLanPortal,sumOfAppLicNo,sumOfLanLicNo } = require('./Calculate')

const server = express()
server.set('view engine', 'ejs')
server.use(express.static('public'))
server.use(bodyParser.urlencoded({extended:true}))
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }))
server.use(passport.initialize())
server.use(passport.session())
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//authenticate route
server.route('/Register')
.get(
    (req,res)=>{
        res.render('Signpage/Auth', {title:'Register'})
    }
)
.post(
    (req,res)=>{
        User.register({username:req.body.username}, req.body.password, (err, user) => {
            if (err) { 
                console.log(`DB register Error: ${err}`)
                res.redirect('/Register') 
            }else{
                passport.authenticate("local")(req,res, ()=>{
                    res.redirect('/')
                })
            }
        })
    }
)

server.route('/Login')
.get(
    (req,res)=>{
        res.render('Signpage/Auth', {title:'Login'})
    }
)
.post(
    (req,res)=>{
        const user = new User(
            {
                username: req.body.username,
                password: req.body.password
            }
        )
        req.login(user, (err)=>{
            if(err){
                console.log(`DB login Error: ${err}`)
                res.redirect('/login') 
            }else{
                passport.authenticate("local")(req,res, ()=>{
                    res.redirect('/')
                })
            }
        })
        
    }
)
server.get('/logout',(req,res)=>{
    req.logout((err)=> {
        if (err) { console.log(`DB logout Error: ${err}`) }
        res.redirect('/Login');
      });
})

// Home route
server.route('/')
.get(
    (req,res)=>{
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            // select all data with decending order of createDate
            SchandDB.find().sort({createDate:-1}).limit().then(
                requests=>{

                    SchandDB.find().then(
                        allRequests=>{
                            const totalRequest = totalRequestFun(allRequests)
                            const totalSchandTotal = sumOfTotalSchandTotalApp(allRequests)
                            const totalLanPortal = sumOfTotalLanPortal(allRequests)
                            const totalAppLicNo = sumOfAppLicNo(allRequests)
                            const totalLanLicNo = sumOfLanLicNo(allRequests)
                            res.render('Home', {
                                title:'Home',
                                totalRequest,
                                totalSchandTotal,
                                totalLanPortal,
                                totalAppLicNo,
                                totalLanLicNo,
                                userAccess,
                                requests
                                }
                            )
                        }
                    )
                    
                }
            ).catch(err=>console.log(`DB Read Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
    }
)

// website input Form route
server.route('/create')
.get(
    (req,res)=>{
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            if(userAccess === 'admin'){
                res.render('Create', {title: 'Create',userAccess})
            }else{
                res.redirect('/')
            }
            
        }else{
            res.redirect('/Login')
        }
        
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
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            if(userAccess === 'admin'){
                const id = req.params.id
                SchandDB.findById(id).then(
                    request=>{
                        res.render('Edit', {title:'Edit',userAccess,request})
                    }
                ).catch(err=>console.log(`DB Edit Error: ${err}`))
            }else{
                res.redirect('/')
            }
            
        }else{
            res.redirect('/Login')
        }
        
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
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            SchandDB.find({status:req.params.status}).sort({createDate:-1}).then(
                requests=>{
                    res.render('Status', {
                        title:'Status',
                        status: req.params.status,
                        userAccess,
                        requests
                        }
                    )
                }
            ).catch(err=>console.log(`DB Read Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
        
    }
)

// all sales person display
server.route('/salePerson')
.get(
    (req,res) => {
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            SchandDB.find().sort({salePerson:1}).then(
                requests=>{
                    
                    res.render('SalePerson/People', {
                        title:'Sale-Person Details',
                        userAccess,
                        requests
                        }
                    )
                }
            ).catch(err=>console.log(`DB Read Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
        
    }
)
// single sales person display
server.route('/salePerson/:id')
.get(
    (req,res) => {
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            SchandDB.findById(req.params.id).then(
                request=>{
                    res.render('SalePerson/PersonInfo', {
                        title:'Sale-Person Details',
                        userAccess,
                        request
                        }
                    )
                }
            ).catch(err=>console.log(`DB Read Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
        
    }
)

//All school details
server.route('/schools')
.get(
    (req,res) => {
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            SchandDB.find().sort({school:1}).then(
                requests=>{
                    res.render('School/Schools', {
                        title:'All School Details',
                        userAccess,
                        requests
                        }
                    )
                }
            ).catch(err=>console.log(`DB Read Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
        
    }
)
// Single school details
server.route('/school/:id')
.get(
    (req,res) => {
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            SchandDB.findById(req.params.id).then(
                request=>{
                    res.render('School/SchoolInfo', {
                        title:'School Details',
                        userAccess,
                        request
                        }
                    )
                }
            ).catch(err=>console.log(`DB Read Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
        
    }
)

// search route for school
server.route('/search')
.post(
    (req,res) => {
        if(req.isAuthenticated()){
            const userAccess = req.session.passport.user
            SchandDB.find({ $text : { $search : req.body.search } }).then(
                requests=>{
                    res.render('School/Schools', {
                        title: 'Search Information',
                        userAccess,
                        requests
                        }
                    )
                }
            ).catch(err=>console.log(`DB Search Error: ${err}`))
        }else{
            res.redirect('/Login')
        }
        
    }
)

//Download csv file of request data
server.get('/download/csv', (req,res)=>{
    if(req.isAuthenticated()){
        SchandDB.find().then(
            requests=>{
                // console.log(requests)
                const currentDate = new Date()
                const csvFileName =  `${__dirname}/../public/backup/Schand.csv`
                const fields = [{
                    label: 'Sale Person',
                    value: 'salePerson.name'
                },{
                    label: 'E-Mail',
                    value: 'salePerson.email'
                },{
                    label: 'School',
                    value: 'school.name'
                },{
                    label: 'State',
                    value: 'school.state'
                }, 'createDate','licNo', 'buildType','status','titles'];

                try {
                    const json2csvParser = new Parser({ fields });
                    const csv = json2csvParser.parse(requests);
                    // console.log(csv);
                    fs.writeFileSync(csvFileName,csv)
                    console.log(`Download csv file Successfully`)
                    res.download(csvFileName,`Schand_${currentDate.toDateString()}.csv`)
                } catch (err) {
                    console.error(err);
                }
                
            }
        ).catch(err=>console.log(`DB Download Json file Error: ${err}`))
    }else{
        res.redirect('/Login')
    }
})

// handle wrong url hit in browser
server.get('*',(req,res)=>{
    res.redirect('/')
})

// Server Listen to below port
server.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})