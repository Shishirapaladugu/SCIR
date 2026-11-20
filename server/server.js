const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Resource = require('./models/Resource');
const ResourceInterest = require('./models/ResourceInterest');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware');

// Load environment variables from local and root directories
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(' Connected to MongoDB successfully!'))
  .catch((err) => console.error(' MongoDB connection error:', err.message));

// Health check route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    const existuser = await User.findOne({ email: email.toLowerCase() });
    if (existuser) {
      return res.status(400).json({
        success: false,
        message: `${email} is already registered`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedpassword
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User successfully registered! You can now log in.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const ispasswordmatch = await bcrypt.compare(password, user.password);
    if (!ispasswordmatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'secretkey',
      {
        expiresIn: '1d'
      }
    );

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

// Upload resource endpoint
app.post('/api/resources', authMiddleware, async (req, res) => {
  try {
    const {
      resourceType,
      title,
      author,
      subject,
      category,
      description,
      academicYear,
      semester,
      institution,
      condition,
      yearsUsed,
      originalPrice,
      listingType,
      expectedPrice,
      phone,
      gmail,
      fileName
    } = req.body;

    if (
      !resourceType ||
      !title ||
      !subject ||
      !category ||
      !description ||
      !institution ||
      !phone ||
      !gmail
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const numericFields = ['yearsUsed', 'originalPrice', 'expectedPrice'];
    const normalizedNumbers = Object.fromEntries(
      numericFields.map((field) => [
        field,
        req.body[field] === '' || req.body[field] === undefined
          ? undefined
          : Number(req.body[field])
      ])
    );

    if (numericFields.some((field) => Number.isNaN(normalizedNumbers[field]))) {
      return res.status(400).json({
        success: false,
        message: 'Numeric fields must contain valid numbers'
      });
    }

    const resource = new Resource({
      resourceType,
      title,
      author,
      subject,
      category,
      description,
      academicYear,
      semester,
      institution,
      condition,
      yearsUsed: normalizedNumbers.yearsUsed,
      originalPrice: normalizedNumbers.originalPrice,
      listingType,
      expectedPrice: normalizedNumbers.expectedPrice,
      phone,
      gmail,
      fileName,
      owner: req.user.id
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource successfully added',
      resource
    });
  } catch (error) {
    console.error('Resource creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while adding resource'
    });
  }
});

// Public resource listings (omits contact details)
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find()
      .select('-phone -gmail -filePath')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      resources: resources.map(({ owner, ...resource }) => ({
        ...resource,
        ownerId: String(owner)
      }))
    });
  } catch (error) {
    console.error('Error fetching public resources:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resources'
    });
  }
});

// Send interest in a resource
app.post('/api/resources/:resourceId/interests', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId).select('owner title');
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    if (String(resource.owner) === String(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You cannot request your own resource' });
    }

    const interest = new ResourceInterest({
      resource: resource._id,
      owner: resource.owner,
      requester: req.user.id,
      status: 'pending'
    });
    await interest.save();

    res.status(201).json({
      success: true,
      message: 'Your interest has been sent to the resource owner'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already requested this resource'
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid resource ID' });
    }
    console.error('Resource interest creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending your request'
    });
  }
});

// Get resource IDs current user has requested (for button disable logic)
app.get('/api/my-resource-interests', authMiddleware, async (req, res) => {
  try {
    const interests = await ResourceInterest.find({ requester: req.user.id })
      .select('resource')
      .lean();
    res.json({
      success: true,
      resourceIds: interests.map((interest) => String(interest.resource))
    });
  } catch (error) {
    console.error('Error fetching sent resource interests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your requests'
    });
  }
});

// Get full list of outgoing requests sent by current user
app.get('/api/my-sent-interests', authMiddleware, async (req, res) => {
  try {
    const interests = await ResourceInterest.find({ requester: req.user.id })
      .populate({
        path: 'resource',
        select: 'title resourceType subject category listingType expectedPrice status owner phone gmail'
      })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Only reveal owner phone & gmail if the interest request was accepted
    const sanitized = interests.map((interest) => {
      if (interest.status !== 'accepted' && interest.resource) {
        const { phone, gmail, ...safeResource } = interest.resource;
        return { ...interest, resource: safeResource };
      }
      return interest;
    });

    res.json({ success: true, interests: sanitized });
  } catch (error) {
    console.error('Error fetching sent interests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your requests'
    });
  }
});

// Get incoming requests for resources owned by current user
app.get('/api/resource-interests', authMiddleware, async (req, res) => {
  try {
    const interests = await ResourceInterest.find({ owner: req.user.id })
      .populate('resource', 'title resourceType subject listingType expectedPrice status')
      .populate('requester', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, interests });
  } catch (error) {
    console.error('Error fetching incoming resource interests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incoming requests'
    });
  }
});

// Update request status (accept / reject)
app.patch('/api/resource-interests/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const interest = await ResourceInterest.findById(req.params.id);
    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest request not found' });
    }

    if (String(interest.owner) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request' });
    }

    interest.status = status;
    await interest.save();

    if (status === 'accepted') {
      await Resource.findByIdAndUpdate(interest.resource, { status: 'reserved' });
    }

    res.json({
      success: true,
      message: `Request marked as ${status}`,
      interest
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating request status'
    });
  }
});

// Get resources uploaded by current user
app.get('/api/my-resources', authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find({
      owner: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Error fetching my resources:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resources'
    });
  }
});

// Delete a resource owned by current user
app.delete('/api/resources/:id', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (String(resource.owner) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    await ResourceInterest.deleteMany({ resource: req.params.id });

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting resource'
    });
  }
});

// Update resource status (e.g. available, reserved, claimed)
app.patch('/api/resources/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['available', 'reserved', 'claimed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (String(resource.owner) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this resource' });
    }

    resource.status = status;
    await resource.save();

    res.json({
      success: true,
      message: `Resource status updated to ${status}`,
      resource
    });
  } catch (error) {
    console.error('Error updating resource status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating resource'
    });
  }
});

// User profile endpoint
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving profile'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
