const express = require("express");
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
connectDB();
const User = require('./models/userModel');

mongoose.connection.once('open', async () => {
  try {
    const newUser = await User.create({
      name: 'Stark',
      phoneNum: '1234567890',
      emailId: 'stark@example.com',
      password: 'passwordisnopassword'
    });

    console.log('Inserted User:', newUser);
  } catch (error) {
    console.error('Error inserting user:', error.message);
  }
});
 
app.get("/",(req,res) =>{    
    res.sendFile(__dirname+"/public/login.html");
})
app.post("/",(req,res) =>{
    const {username,password} = req.body;
    console.log(username,password);
    res.sendFile(__dirname+"/public/home.html")
})
app.get("/register",(req,res) =>{
    res.sendFile(__dirname+"/public/register.html")
})
app.post("/register",(req,res) =>{
    const {name,phone,email,password,cpassword} = req.body;
    console.log(name,phone,email,password,cpassword);
    if(password === cpassword){
    res.sendFile(__dirname+"/public/home.html")
    }
    else{
    res.sendFile(__dirname+"/public/register.html")
    }
})
app.listen(2000,() =>{
    console.log("server running in 2000");
})