const Review = require("../models/Review");
const Places = require("../models/Places");

exports.AddReview = async (req, res) => {
    const { place_id, user_id, rating, comment } = req.body;
  
    try {
      // Call Python API for sentiment analysis
      const sentimentResponse = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: comment })
    });
    
    const sentimentData = await sentimentResponse.json();
    
      console.log(sentimentData)
  
        const sentiment = sentimentData.sentiment;
        const sentimentScore = sentimentData.score;
  
        // Save review with sentiment
        const newReview = new Review({
            place_id, 
            user_id, 
            rating, 
            comment, 
            sentiment, 
            sentiment_score: sentimentScore, 
            created_at: new Date()
        });
        await newReview.save();
  
        // Recalculate place ranking
        const reviews = await Review.find({ place_id });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
        // Calculate the average sentiment score (use the compound value of the sentiment score)
        const avgSentimentScore = reviews.reduce((sum, r) => sum + r.sentiment_score.compound, 0) / reviews.length;
  
        // New weighted score (combining rating & sentiment)
        const weightedScore = (avgRating * 0.7) + (avgSentimentScore * 0.3);
  
        await Places.findByIdAndUpdate(place_id, {
            average_rating: avgRating.toFixed(1),
            sentiment_score: avgSentimentScore.toFixed(2), // Use average sentiment score
            weighted_score: weightedScore.toFixed(2),
            reviews_count: reviews.length
        });
  
        res.json({ message: "Review added with sentiment analysis" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  };
  
  
exports.FindReviews = async (req, res) => {
    try {
        // console.log('here')
      const reviews = await Review.find({ place_id: req.params.placeId })
        .populate('user_id', 'firstName email'); // Fetch user details (adjust fields as needed)
  
      res.json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  