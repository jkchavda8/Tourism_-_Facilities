const express = require("express");
const reviewController = require("../controllers/reviewController");
const router =  express.Router();

router.post('/addReview',reviewController.AddReview);

router.get('/:placeId',reviewController.FindReviews);

module.exports = router;