const express = require("express");
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // folder where your .ejs files are
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const https = require("https");
const axios = require('axios');
app.use(express.static('public')); 
connectDB();
app.use('/uploads', express.static('uploads'));
const User = require('./models/userModel');
const Post = require('./models/postModel');
const cors = require('cors');
const cron = require('node-cron');

require('dotenv').config();
app.use(express.json());

// Middleware to parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true
}));


const session = require('express-session');

app.use(session({
  secret: 'project-secret-key',   // used to sign and encrypt the session ID cookie
  resave: false,
  saveUninitialized: true,
}));


//Setting up Cron To Check For Expiry Date Every 3 Minutes
cron.schedule('*/5 * * * *', async () => { // every 5 minutes
  try {
    const now = new Date();
    const result = await Post.updateMany(
      { expiresAt: { $lte: now }, status: 'active' },
      { $set: { status: 'expired' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} posts marked as expired`);
    }
  } catch (err) {
    console.error("Error marking expired posts:", err);
  }
}); 


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
    return res.status(200).send('success')

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Database Server Error, please try again.');
  }
});
// Register page

app.post("/register", async (req, res) => {
  const { name, phone, email, password, cpassword } = req.body;

  if (password === cpassword) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name,
        phoneNum: phone,
        emailId: email,
        password: hashedPassword
      });

      console.log('Inserted user:', newUser);
      res.status(200).send("User registered successfully");
    } catch (error) {
      console.error('Error inserting user:', error.message);
      res.status(500).send('Error occurred, please try again.');
    }
  } else {
    res.status(400).send("Password Does Not Match Confirm Password");
  }
});

// Home page
app.get("/home",requireLogin,async(req,res) =>{
  const posts = await Post.find({status:"active",expiresAt: { $gt: new Date() }});
  posts.reverse()
  res.json(posts)
})
// Post page
app.get("/post",requireLogin,(req,res) =>{
  res.sendFile(__dirname+"/public/post.html");
})
app.post("/post", upload.single('img'), async (req, res) => {
  const { name, description, category, condition, address,expiresAt } = req.body;
  const img = req.file;
  const url1 = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&limit=1&apiKey=${process.env.mykey}`;
  if (!expiresAt || isNaN(new Date(expiresAt))) {
  return res.status(400).send("Invalid expiry date.");
}
const expiryDate = new Date(expiresAt);


  try {
    const user = await User.findOne({ emailId: req.session.email });
    if (!user) {
      return res.status(401).send("User not logged in or session expired");
    }

    const response = await axios.get(url1);
    const locationData = response.data;
    const lat = locationData.features[0]?.geometry?.coordinates[1];
    const lon = locationData.features[0]?.geometry?.coordinates[0];

    if (lat === undefined || lon === undefined) {
      return res.status(400).send("Could not determine location from address");
    }

    const newpost = await Post.create({
      name,
      description,
      emailId: req.session.email,
      username: user.name,
      category,
      condition,
      imgpath: img.path,
      address,
      lat,
      lon,
      expiresAt: expiryDate
    });

    res.redirect("/home");
  } catch (error) {
    console.error("Error while inserting post:", error.message);
    res.status(400).send("Some error occurred. Try again.");
  }
});

// Search Page

app.get("/search", async (req, res) => {
  try {
    const { name, category, condition, address, radius } = req.query;

    // Create base query with only active posts
    const query = { status: "active" ,expiresAt: { $gt: new Date() }};
    

    // Search By Name (case-insensitive)
    if (name) {
      query.name = new RegExp(name, 'i');
    }

    // Search By Category (case-insensitive)
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    // Search By Condition (exact match)
    if (condition) {
      query.condition = condition;
    }

    // Fetch all matching posts (before location filtering)
    const allPosts = await Post.find(query);

    // If address and radius are provided, apply location-based filtering
    if (address && radius) {
     
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&limit=1&apiKey=${process.env.mykey}`;

      // Make request to Geoapify to get lat and lon of the input address
      https.get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const locationData = JSON.parse(data);
          const centerLat = locationData.features[0]?.geometry?.coordinates[1]; // latitude
          const centerLon = locationData.features[0]?.geometry?.coordinates[0]; // longitude

          // If address is invalid or not found
          if (centerLat === undefined || centerLon === undefined) {
            return res.status(400).send("Invalid address");
          }

          // Filter posts by calculating distance from address coordinates
          const filteredPosts = allPosts.filter((post) => {
            const d = haversineDistance(centerLat, centerLon, post.lat, post.lon);
            return d <= parseFloat(radius); // keep only posts within the radius
          });

          // Return filtered posts to frontend
          res.json(filteredPosts);
        });
      });
    } else {
      // If no address or radius provided, return all matching posts
      res.json(allPosts);
    }

  } catch (error) {
    console.error('Error searching posts:', error.message);
    res.status(500).send('Server error.');
  }
});

// Function to calculate distance between two coordinates using Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180; // Convert degrees to radians
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in kilometers
}


// History page
app.get("/history",requireLogin,async(req,res) =>{
  
  const query = {emailId: req.session.email}
  const { status } = req.query;
  if (status){
    query.status = status
  }
  const userposts = await Post.find(query).sort({_id:-1});
  res.json({userposts,status});
})
// details page
app.get('/details',requireLogin, async(req, res) => {
  const email = req.query.email;
  const postId = req.query.id;
  // Use the email to find the post or user
  const  user = await User.findOne({ emailId: email })
  const post = await Post.findById(postId);
  res.json({user,post});
});


// Delete or Sold
app.post('/mark_sold/:id', async (req, res) => {
  try {
    const postId = req.params.id
    await Post.findByIdAndUpdate(postId, { status: "sold" });
  } catch (error) {
    console.error('Error Marking post:', error.message);
    res.status(500).send('Failed to Mark As Sold Post');
  }
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