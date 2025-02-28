const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: true
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
            }
        },
        listingPhotoPaths: [{type:String}],
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status:{
            type:String,
            default: "Pending",
        },
        coordinates: {
            type: {
            type: String, // Must be "Point"
            enum: ["Point"], // Only "Point" is supported for GeoJSON
            required: true,
            },
            coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            },
        },
    },
    {timestamps : true}
)

RestaurantSchema.index({ coordinates: '2dsphere' });

const Restaurant = mongoose.model("Restaurant",RestaurantSchema);
module.exports = Restaurant;