const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    place_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true 
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    },
    rating: {
        type: Number, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    sentiment: { 
        type: String, 
        enum: ["positive", "negative", "neutral"], 
        required: true 
    },
    sentiment_score: { 
        type: Object, 
        required: true, 
        default: { compound: 0, pos: 0, neu: 0, neg: 0 }
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
