const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Set up storage engine for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Store images in the 'public/images' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// File upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed extensions
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// Handle image upload and validate the request body
const handleImageUpload = (req, res, next) => {
  upload.single('profileImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    next();
  });
};

// Signup route with file upload handling
exports.signup = async (req, res) => {
  try {
    
    handleImageUpload(req, res, async () => {
    
      const profileImagePath = req.file ? `/images/${req.file.filename}` : '';
      const { password, ...otherDetails } = req.body;

      const hashedPassword = await bcrypt.hash(password, 13);

      const user = new User({
        ...otherDetails,
        password: hashedPassword,
        profileImagePath: profileImagePath, // Save image path if available
      });

      const savedUser = await user.save();
      const authToken = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '6h' });

      res.status(200).json({
        user: savedUser,
        authToken
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Registration failed!', error: e.message });
  }
};

// Login route
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Password mismatch' });
    }

    const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      user,
      authToken
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Login failed!', error: e.message });
  }
};

exports.addToWishlist = async (req, res) => {
  const { userId, placeId } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if placeId is already in the wishlist
    const isAlreadyInWishlist = user.wishList.includes(placeId);

    if (isAlreadyInWishlist) {
      // Remove placeId from wishlist
      user.wishList = user.wishList.filter((id) => id !== placeId);
    } else {
      // Add placeId to wishlist
      user.wishList.push(placeId);
    }

    // Save updated user document
    await user.save();

    res.status(200).json({
      message: isAlreadyInWishlist ? "Place removed from wishlist" : "Place added to wishlist",
      wishList: user.wishList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

};
exports.fetchWishList = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the route params

  try {
    // Find user by ID
    const user = await User.findById(userId).populate('wishList'); // Populate the wishList with place details
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's wishlist
    res.status(200).json({ wishList: user.wishList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const mongoose = require("mongoose");

exports.updateProfile = async (req, res) => {
  try {
    handleImageUpload(req, res, async () => {
      const { userId } = req.params;
      const { firstName, lastName, email } = req.body;

      console.log("User ID:", userId);

      // Convert userId to ObjectId
      const objectId = new mongoose.Types.ObjectId(userId);

      // Find user by ID
      let user = await User.findOne({ _id: objectId });

      console.log("User Found:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prepare update data
      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;

      console.log("Updating with:", updateData);

      // Update profile image if a new one is uploaded
      if (req.file) {
        updateData.profileImagePath = `/images/${req.file.filename}`;
      }

      // Update user details
      await User.updateOne({ _id: objectId }, { $set: updateData });

      // Fetch updated user details
      user = await User.findOne({ _id: objectId });

      // Generate new auth token
      const authToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "6h" }
      );

      res.status(200).json({
        message: "Profile updated successfully",
        user,
        authToken
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Profile update failed!",
      error: e.message
    });
  }
};
