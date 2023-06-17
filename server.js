const express = require("express");
const app = express();
const path = require('path');
const User = require('./Models/user');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/jsm',{useNewUrlParser: true,useUnifiedTopology: true})
        .then(()=>{
            console.log("\nConnection Open!\n");
        })
        .catch(err => {
            console.log("\nConnection Error has Occured!\n");
            console.log(err);
        })


app.listen(3000,()=>{
    console.log("\nListening to Port 3000!\n");
})

app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/views'))

//load static assets
app.use('/static',express.static(path.join(__dirname,'css')));
app.use('/stat',express.static(path.join(__dirname,'jst')));

app.use(express.urlencoded({extended: true}));
app.use(session({secret:"logged in"}));

//home route
app.get('/login',(req,res)=>{
    console.log("Login Page has been opened!");
    let validPassword=true;
    res.render('index',{validPassword});
})

//..........Register..............................
// app.post('/home',async (req,res)=>{
//     console.log("Reveived Post request")
//     const {username,password}=req.body;
//     const hash = await bcrypt.hash(password,12);
//     const user = new User({
//         username,
//         password: hash
//     })
//     await user.save();
//     res.send(hash);
// })

app.post('/home',async (req,res)=>{
    const {username,password}=req.body;
    const user = await User.findOne({username});
    validPassword = await bcrypt.compare(password,user.password)
    if (validPassword) {
        req.session.user_id = user._id;
        res.render('home');
    }
    else{
         res.render('index',{validPassword});
    }
})

app.get('/home',(req,res)=>{
    if(req.session.user_id){
       return res.render('home');
    }
    res.redirect('/login');
})

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})

app.get('/forgot_password',(req,res)=>{
    console.log("Forget Password Page Opened!");
    res.render('FP');
})

app.post('/login',(req,res)=>{
    console.log("Redirected to Login Page from FP Page!");
    res.redirect('/login');
})