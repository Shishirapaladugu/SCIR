const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();


const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(' Connected to MongoDB successfully!'))
  .catch((err) => console.error(' MongoDB connection error:', err.message));

// Health check route
app.get('/', (req, res) => {
  res.send('Backend is running');
});
/*

*/
//Register endpoint
app.post('/api/register',async(req,res)=>{
  try{
    const {name,email,password}=req.body;
     //validation
    if(!name||!email||!password){
      return res.status(400).json({
        success:false,
        message:'Please provide name,email and password'
      })
    }
    //already exist
    const existuser=await User.findOne({email:email.toLowerCase()});
    if(existuser){
      return res.status(400).json({
        success:false,
        message:`${email} is already registered`
      })
    }
    //hasedpassword
    const salt=await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);
    //create user
    const user=new User({
      name,
      email:email.toLowerCase(),
      password:hashedpassword
    })
    await user.save();
    res.status(200).json({
      success:true,
      message:' User successfully registered! You can now log in.'
    })

  }
  catch(error){
    res.status(500).json({
      success:false,
      message:'Server error during registration: '+error.message
    })
  }
})

//AUTHENTICATION ENDPOINTS
app.post('/api/login',async(req,res)=>{
  try{
    const {email,password}=req.body;
    
    //validate
    if(!email||!password){
      return res.status(400).json({
        success:false,
        message:'please provide both email and password'
      })
    }
    const user=await User.findOne({email:email.toLowerCase()});
    if(!user){
      return res.status(400).json({
        success:false,
        message: 'invalid email or password'
      })
    }
    const ispasswordmatch=await bcrypt.compare(password,user.password);
    if(!ispasswordmatch){
      return res.status(400).json({
        success:false,
        message:'invalid email or password'
      })
    }

    //generate jwt token
    const token=jwt.sign(
    {
      id:user._id,
      email:user.email,
      name:user.name
    },
      process.env.JWT_SECRET||'secretkey',
      {
        expiresIn:'1d'
      }
    );
    res.status(200).json({
      success:true,
      message:'Access granted',
      token:token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  }
   catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message
    });
  }
});

/*

// 2. LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Check if user exists in database
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    // If credentials are valid, give access
    res.status(200).json({
      success: true,
      message: 'Access granted',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message
    });
  }
});
*/
// Start Server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
