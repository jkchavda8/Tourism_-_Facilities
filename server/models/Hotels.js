const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
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
            },
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
        // Geospatial field for queries
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
);

HotelSchema.index({ coordinates: '2dsphere' });

const Hotel = mongoose.model("Hotel",HotelSchema);
module.exports = Hotel;