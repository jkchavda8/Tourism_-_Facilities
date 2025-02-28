const mongoose = require("mongoose");


const PlaceSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status:{
            type:String,
            default: "Pending",
        },
        categories:{
            type: [String],
            required:true,
        },
        address: {
            streetAddress: {
                type: String,
                required: true,
            },
            pincode: {
                type: Number,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            latitude:{
                type:Number,
                required:true
            },
            longitude:{
                type:Number,
                required:true
            }
        },
        placePhotoPaths: [{type:String}],
        
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            default: 0
        },
        average_rating: { 
            type: Number, 
            default: 0 
        },
        sentiment_score: { 
            type: Number, 
            default: 0 
        },
        weighted_score: { 
            type: Number, 
            default: 0 
        },
        reviews_count: { 
            type: Number, 
            default: 0 
        }
    },
    {timestamps: true}
)

const Places = mongoose.model("Places",PlaceSchema);
module.exports = Places;