const express = require("express");
const { check } = require("express-validator");
const { signup, login,addToWishlist, fetchWishList,updateProfile } = require("../controllers/userController");

const router = express.Router();

// Define signup route with validation
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Invalid email address"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  signup
);

// Define login route
router.post("/login", login);

router.post("/wishlist", addToWishlist);
router.get('/wishlist/:userId',fetchWishList);
router.post('/update-profile/:userId',updateProfile);

module.exports = router;
