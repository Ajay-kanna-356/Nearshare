const express = require("express");
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const app = express();

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
    res.send("Testing....");
})

app.listen(2000,() =>{
    console.log("server running in 2000");
})