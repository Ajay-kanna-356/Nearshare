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
});


app.post("/",async(req,res) =>{
    const {email,password} = req.body;
    console.log(email,password);
    try {
    // Find user by their username OR email — depends on your schema
    const user = await User.findOne({ emailId: email }); 
    
    // Finding Email-Id
    if (!user) {
      return res.status(400).send('User not found.');
    }
    // Password Check 
    if (user.password !== password) {
      return res.status(400).send('Incorrect password.'); // For now it is Showing As Error Message Further Will Be Enhanced
    }

    //Successful login
    res.sendFile(__dirname + "/public/home.html");

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Database Server Error, please try again.');
  }
});

app.get("/register",(req,res) =>{
    res.sendFile(__dirname+"/public/register.html")
})
app.post("/register",async(req,res) =>{
    const {name,phone,email,password,cpassword} = req.body;
    
    console.log(name,phone,email,password,cpassword);
    
    // Confirm password Check 
    if(password === cpassword){ 
     try {
    // Inserting User Into MongoDB
    const newUser = await User.create({
      name: name,
      phoneNum: phone,
      emailId: email,
      password: password
    });

    console.log('Inserted user:', newUser);
    res.sendFile(__dirname + "/public/login.html");
  } catch (error) {
    console.error('Error inserting user:', error.message);
    res.status(500).send('Error occurred, please try again.');
  }
    }

    else{
    res.status(400).send(("Password Does Not Match Confirm Password"))
    res.sendFile(__dirname+"/public/register.html")
    }

    
});

app.listen(2000,() =>{
    console.log("server running in 2000");
})