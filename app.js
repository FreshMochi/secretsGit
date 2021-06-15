//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')


const app = express()
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/secrets', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })

const User = new mongoose.model("User", userSchema)



app.route('/')

.get((req, res)=> {
    res.render('home')
});

app.route("/login")

.get((req, res) => {
    res.render('login')
})

.post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, fd) => {
    if(fd) {
      if(fd.password === password) {
        res.render('secrets')
      } else {
        console.log("User or Password is incorrect")
      }

    } else {
      console.log(err)
      console.log("input info does not match")
    }
  })
});

app.route("/register")
.get((req, res) => {
    res.render('register')
})
.post((req,res)=>{
    const user = req.body.username;
    const password = req.body.password;

    User.findOne({email: user}, (err, fd) => {
        if(!err){
          if(!fd){
            const newUser = new User({
            email: user,
            password: password
            })
            newUser.save( err => {
              if(err) {
                console.log(err)
              } else {
                res.render("secrets")
              }
            })
        } else {
          console.log("this is an existing account")
        }
      } else {
        console.log(err)
      }
    })
    
})

app.listen(3000, function(){
    console.log("running on port:3000")
})