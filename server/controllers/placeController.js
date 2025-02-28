const Places = require('../models/Places');
const User = require('../models/User');
const Hotel = require('../models/Hotels');
const Review = require('../models/Review')
const Restaurant = require('../models/Restaurants')
const fs = require('fs');
const multer = require('multer');
const path = require('path');

exports.getAllPlaces = async (req, res) => {
  try {
    const { category } = req.query;

      // Build the query object dynamically
    // console.log(category);

    let places = {};
    if(category){
       places = await Places.find({
        status : "approved",categories:category}); 
    }
    else{
      places = await Places.find({
        status : "approved"}); 
    }
    console.log(places);
    
    const placesWithImages = places.map(place => {
      place.placePhotoPaths = place.placePhotoPaths.map(photo => {
        // Directly return the correct path for the image
        return `/images/${photo.split('/').pop()}`;
      });
      return place;
    });
    res.json(placesWithImages);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllPlaceForAdmin = async (req, res) => {
  try {
    const query = req.query.query || '';
    const status = req.query.status || '';
    // console.log(status)
    // Build the search conditions
    const searchConditions = {
      status:status,
      $or: [
        { title: { $regex: query, $options: 'i' } },
      ],
    };
    let places = await Places.find(searchConditions);
    const placesWithImages = places.map(place => {
      place.placePhotoPaths = place.placePhotoPaths.map(photo => {
        // Directly return the correct path for the image
        return `/images/${photo.split('/').pop()}`;
      });
      return place;
    });
    res.json(placesWithImages);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const place = await Places.findById(id);  // This will return a single place, not an array

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Modify the place's photo paths directly
    place.placePhotoPaths = place.placePhotoPaths.map(photo => {
      // Directly return the correct path for the image
      return `/images/${photo.split('/').pop()}`;
    });

    // console.log("here");
    res.json(place);  // Send the modified place as a response
  } catch (error) {
    console.error('Error fetching place:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getByUser = async (req,res) => {
  try {

    const id = req.params.id;
    const places = await Places.find({owner:id});  

    const placesWithImages = places.map(place => {
      place.placePhotoPaths = place.placePhotoPaths.map(photo => {
        // Directly return the correct path for the image
        return `/images/${photo.split('/').pop()}`;
      });
      // console.log(palce);
      return place;
    });
    res.json(placesWithImages);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.createPlace = async (req, res) => {
  try {
    const { title, description, price, categories, address, owner } = req.body;
    // console.log('Files:', req.files); // Log uploaded files
    // console.log('Body:', req.body);

    if (!address) {
      throw new Error('Address is required.');
    }

    // Parse address JSON string
    const parsedAddress = JSON.parse(address);
    const or = JSON.parse(owner);
    
    // Ensure numeric fields are converted to numbers
    const {
      streetAddress,
      city,
      state,
      country,
      pincode,
      latitude,
      longitude,
    } = parsedAddress;

    // Validate required fields
    if (!streetAddress || !city || !state || !country) {
      throw new Error('Address fields are missing');
    }

    if (isNaN(pincode) || isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Pincode, latitude, and longitude must be valid numbers');
    }
    
    // console.log(categories)
    let categoriesArray = categories.split(',').map(item => item.trim());
    // console.log(categoriesArray)

    // Prepare the address data
    const addressData = {
      streetAddress,
      city,
      state,
      country,
      pincode: Number(pincode),
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    let st = or._id;
    // console.log(st)
    // Create the new place object
    const newPlace = new Places({
      title,
      description,
      price: price ? Number(price) : 0,
      categories: categoriesArray,
      address: addressData,
      owner: st,
      placePhotoPaths: req.files ? req.files.map((file) => file.path.replace(/\\/g, '/')) : [],
    });

    // Save the new place to the database
    const savedPlace = await newPlace.save();

    if (or) {
      // console.log(st);
      await User.updateOne({ _id: st }, { $push: { contributeList: savedPlace._id } });
    }

    res.status(201).json({ message: 'Place created successfully', place: savedPlace });
  } catch (error) {
    console.error('Error creating place:', error.message);
    res.status(500).json({ error: 'Failed to create place', details: error.message });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const placeId = req.params.id;
    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required.' });
    }

    console.log('Updating place with ID:', placeId);

    const { title, description, price, categories, address } = req.body;

    // Find the existing place
    const existingPlace = await Places.findById(placeId);
    if (!existingPlace) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Parse and validate address if provided
    let updatedAddress = existingPlace.address; // Retain current address if not provided
    if (address) {
      const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
      const {
        streetAddress,
        city,
        state,
        country,
        pincode,
        latitude,
        longitude,
      } = parsedAddress;

      if (!streetAddress || !city || !state || !country) {
        return res.status(400).json({ error: 'Address fields are missing' });
      }

      if (isNaN(pincode) || isNaN(latitude) || isNaN(longitude)) {
        return res
          .status(400)
          .json({ error: 'Pincode, latitude, and longitude must be valid numbers' });
      }

      updatedAddress = {
        streetAddress,
        city,
        state,
        country,
        pincode: Number(pincode),
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    }

    const categoriesArray = (() => {
      if (!categories) return existingPlace.categories;

      let parsedCategories = [];
      try {
        parsedCategories = JSON.parse(categories);
        if (!Array.isArray(parsedCategories)) throw new Error('Categories should be an array.');
      } catch (error) {
        parsedCategories = categories.split(',').map((item) => item.trim());
      }
      return [...new Set(parsedCategories)].filter((item) => item);
    })();

    // Prepare the updated data
    const updatedData = {
      title: title || existingPlace.title,
      description: description || existingPlace.description,
      price: price ? Number(price) : existingPlace.price,
      categories: categoriesArray,
      address: updatedAddress,
      placePhotoPaths: req.files
        ? req.files.map((file) => file.path.replace(/\\/g, '/'))
        : existingPlace.placePhotoPaths,
    };

    // Update the place in the database
    const updatedPlace = await Places.updateOne({ _id: placeId }, updatedData);
    console.log('Update result:', updatedPlace);

    if (updatedPlace.matchedCount === 0) {
      return res.status(404).json({ error: 'No place found to update' });
    }

    res.status(200).json({
      message: 'Place updated successfully',
      updatedPlace,
    });
  } catch (error) {
    console.error('Error updating place:', error.message);
    res.status(500).json({ error: 'Failed to update place', details: error.message });
  }
};


exports.deletePlace = async (req,res) => {
  try {
    const placeId = req.params.id; // Get the place ID from the route parameter

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    // Find the place to delete
    const placeToDelete = await Places.find({_id:placeId});
    if (!placeToDelete) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Remove the place from the User's contributeList
    let ur = req.body;
    if (ur && ur._id) {
      const user = await User.findOne({ _id: ur._id });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // console.log('User\'s contributeList before update:', user.contributeList);
      // console.log(placeId);
      const { ObjectId } = require('mongoose').Types;
      const placeIdObject = ObjectId.isValid(placeId) ? new ObjectId(placeId) : placeId;
      const re = await User.updateOne(
        { _id: ur._id },
        { $pull: { contributeList: placeIdObject } } // Ensure placeId is the correct type
      );

      if (re.modifiedCount === 0) {
        console.log('No place was removed from contributeList');
      } else {
        console.log('Place removed from contributeList:', re);
      }
    }

    // Delete the place from the database
    const deletedPlace = await Places.deleteOne({_id:placeId});

    res.status(200).json({ message: 'Place deleted successfully', place: deletedPlace });
  } catch (error) {
    console.error('Error deleting place:', error.message);
    res.status(500).json({ error: 'Failed to delete place', details: error.message });
  }
}

exports.changeStatus =  async (req, res) => {
  try {
    const placeId = req.params.id;
    const place = await Places.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Toggle the status
    if (place.status === 'Pending') {
      place.status = 'approved';
    } else if (place.status === 'approved') {
      place.status = 'blocked';
    } else if (place.status === 'blocked') {
      place.status = 'approved';
    }

    await place.save();
    res.status(200).json(place);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

exports.searchPlaces = async (req, res) => {
  try {
    const query = req.query.query || '';

    const category = req.query.categories; 
    const price = req.query.price;
    const pincode = req.query.address ? req.query.address.pincode : undefined;  // Check for pincode in the address

    // Build the search conditions
    const searchConditions = {
      status: "approved", // Ensures only approved places are considered
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description : { $regex: query, $options: 'i'}},
        { 'address.city': { $regex: query, $options: 'i' } },
        { 'address.state': { $regex: query, $options: 'i' } },
        { 'address.country': { $regex: query, $options: 'i' } },
        { 'address.streetAddress': { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };

    // Check if the query can be a valid pincode
    if (!isNaN(query)) {
      searchConditions.$or.push({ 'address.pincode': Number(query) });
      searchConditions.$or.push({ price: Number(query) });
    }

    if (category) {
      searchConditions.categories = { $in: [category] }; // Use $in to match category
    }
    if (price) {
      // You can add range-based filtering for price, if needed:
      const priceValue = parseFloat(price);
      if (!isNaN(priceValue)) {
        searchConditions.price = priceValue;
      }
    }
    if (pincode) {
      const pincodeValue = parseFloat(pincode);
      if (!isNaN(pincodeValue)) {
        searchConditions['address.pincode'] = pincodeValue;
      }
    }

    // Fetch places based on the search conditions
    let places = await Places.find(searchConditions);

    places = places.sort((a, b) => b.weighted_score - a.weighted_score);

    // console.log(places)
    // Transform placePhotoPaths for consistent URLs
    const placesWithImages = places.map((place) => {
      place.placePhotoPaths = place.placePhotoPaths.map((photo) => {
        return `/images/${photo.split('/').pop()}`; // Ensure correct path for image
      });
      return place;
    });

    res.status(200).json({ success: true, data: placesWithImages });
  } catch (error) {
    console.error("Error searching places:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.findNearbyHotelsForPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    // Step 1: Find the place by its ID
    const place = await Places.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }
    
    // Extract latitude and longitude from the place's address
    const { latitude, longitude } = place.address;

    // Step 2: Find nearby hotels with status "approved"
    const maxDistanceInMeters = 5000; // 5 km
    const nearbyHotels = await Hotel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistanceInMeters,
          key: "coordinates"
        }
      },
      {
        $match: { status: "approved" } // Only approved hotels
      }
    ]);

    // Step 3: Check if any hotels are found before processing images
    if (!nearbyHotels.length) {
      return res.status(404).json({ message: "No nearby approved hotels found." });
    }

    // Map hotel data to update image paths
    const hotelWithImages = nearbyHotels.map(hotel => {
      if (hotel.listingPhotoPaths) {
        hotel.listingPhotoPaths = hotel.listingPhotoPaths.map(photo => {
          return `/images/${photo.split('/').pop()}`;
        });
      }
      return hotel;
    });

    // Send response with nearby approved hotels
    return res.json(hotelWithImages);  // ✅ Ensures a single response

  } catch (error) {
    console.error("Error finding nearby hotels:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.findNearbyRestaurantsForPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    // Step 1: Find the place by its ID
    const place = await Places.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }
    
    // Assuming the place has latitude and longitude within the address object
    const { latitude, longitude } = place.address;

    // Step 2: Find nearby restaurants with status "approved"
    const maxDistanceInMeters = 5000; // 5 km radius
    const nearbyRestaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistanceInMeters,
          key: "coordinates"
        }
      },
      {
        $match: { status: "approved" } // Only approved restaurants
      }
    ]);

    // Step 3: Check if any restaurants are found and return immediately
    if (!nearbyRestaurants.length) {
      return res.status(404).json({ message: "No nearby approved restaurants found." });
    }

    // Map restaurant data to add correct paths for images (if any)
    const restaurantWithImages = nearbyRestaurants.map(restaurant => {
      if (restaurant.listingPhotoPaths) {
        restaurant.listingPhotoPaths = restaurant.listingPhotoPaths.map(image => {
          return `/images/${image.split('/').pop()}`;
        });
      }
      return restaurant;
    });

    // Send response with nearby approved restaurants
    return res.json(restaurantWithImages);  // ✅ Ensures a single response

  } catch (error) {
    console.error("Error finding nearby restaurants:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
