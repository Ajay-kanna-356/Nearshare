const express = require("express");
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // folder where your .ejs files are
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
connectDB();
app.use('/uploads', express.static('uploads'));
const User = require('./models/userModel');
const Post = require('./models/postModel');

const session = require('express-session');

app.use(session({
  secret: 'project-secret-key',   // used to sign and encrypt the session ID cookie
  resave: false,
  saveUninitialized: true,
}));

// Setting up multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save in uploads folder
  },
  filename: function (req, file, cb) {
    // Saving with timestamp + original name to avoid duplicate names
    cb(null, Date.now() + '-' + file.originalname);
  }
});

function requireLogin(req, res, next) {
  if (req.session.email) {
    next(); // User is logged in, proceed
  } else {
    res.redirect('/'); // Not logged in, redirect to login page
  }
}
const upload = multer({ storage: storage });

 // Home page
app.get("/",(req,res) =>{    
    res.sendFile(__dirname+"/public/login.html");
});

app.post("/",async(req,res) =>{
    const {email,password} = req.body;
    try {
    // Find user by their username OR email — depends on your schema
    const user = await User.findOne({ emailId: email }); 
    
    // Finding Email-Id
    if (!user) {
      return res.status(400).send('User not found.');
    }
    // Password Check 
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).send('Incorrect password.'); 
    }
    req.session.email = email; 
    //Successful login
    res.redirect("/home");

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Database Server Error, please try again.');
  }
});
// Register page
app.get("/register",(req,res) =>{
    res.sendFile(__dirname+"/public/register.html")
})
app.post("/register",async(req,res) =>{
    const {name,phone,email,password,cpassword} = req.body;
    // Confirm password Check 
    if(password === cpassword){ 
     try {
    // Inserting User Into MongoDB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      phoneNum: phone,
      emailId: email,
      password: hashedPassword
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
// Home page
app.get("/home",requireLogin,async(req,res) =>{
  const posts = await Post.find();
  posts.reverse()
  console.log(posts);
  res.render("home", { posts });
   
})
// Post page
app.get("/post",requireLogin,(req,res) =>{
  res.sendFile(__dirname+"/public/post.html");
})
app.post("/post",upload.single('img'),async(req,res) =>{
  const {name,description,category,condition} = req.body;
  const img = req.file;
  console.log(name,description,category,img.path,req.session.email,condition);
  try{
    const user = await User.findOne({ emailId: req.session.email });
    const newpost = await Post.create({
      name:name,
      description:description,
      emailId:req.session.email,
      username: user.name,
      category:category,
      condition:condition,
      imgpath:img.path
    })
    res.redirect("/home");

  }
  catch(error){
  console.error('Error while inserting post:', error.message);
    res.status(400).send((" Some error occured try again"))
  }
})

// Search Page

app.get("/searchpage",requireLogin,(req,res)=>{
    res.sendFile(__dirname+"/public/search.html")
})

app.get("/search", async(req,res)=>{
    try {
    const { name, category, condition } = req.query;
    const query = {};

    // Search By Name
    if (name) {
      query.name = new RegExp(name, 'i'); // case-insensitive
    }
    // Search By Category
    if (category) {
      query.category = new RegExp(category, 'i'); // case-insensitive
    }
    // Search By Condition
    if (condition) {
      query.condition = condition; // exact match
    }

    // Fetch all matching posts
    const posts = await Post.find(query);

    // Respond with the list of posts as JSON
   
    res.render("result", { posts });
    
  } catch (error) {
    console.error('Error searching posts:', error.message);
    res.status(500).send('Server error.');
  }
});

// History page
app.get("/history",requireLogin,async(req,res) =>{
  const userposts = await Post.find({emailId: req.session.email});
  res.render("history",{userposts});
})
// details page
app.get('/details',requireLogin, async(req, res) => {
  const email = req.query.email;
  // Use the email to find the post or user
  const  user = await User.findOne({ emailId: email })
  res.render("details", { user });
});

//logout 
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Could not log out.");
    }
    res.redirect('/');
  });
});
app.listen(2000,() =>{
    console.log("server running in 2000");
})