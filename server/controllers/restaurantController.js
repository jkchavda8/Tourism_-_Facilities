const User = require('../models/User');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Restaurant = require('../models/Restaurants');

exports.createRestaurant = async (req, res) => {
    try {
      const { title, description, price,  address, owner } = req.body;
  
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
  
      // Prepare the address data
      const addressData = {
        streetAddress,
        city,
        state,
        country,
        pincode: Number(pincode),
      };
  
      let st = or._id;
      const coordinatesData = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      };

      const newRestaurant = new Restaurant({
        title,
        description,
        price: price ? Number(price) : 0,
        address: addressData,
        owner: st,
        listingPhotoPaths: req.files ? req.files.map((file) => file.path.replace(/\\/g, '/')) : [],
        coordinates: coordinatesData
      });
  
      const savedRestaurant= await newRestaurant.save();
  
      if (or) {
        // console.log(st);
        await User.updateOne({ _id: st }, { $push: { contributeList: savedRestaurant._id } });
      }
      // console.log(req.body)
      res.status(201).json({ message: 'Restaurant created successfully', restaurant: savedRestaurant });
    } catch (error) {
      console.error('Error creating Restaurant:', error.message);
      res.status(500).json({ error: 'Failed to create Restaurant', details: error.message });
    }
  };

  exports.getAllRestaurant = async (req, res) => {
    try {
      const query = req.query.query || '';
      const status = req.query.status || '';
       // Build the search conditions
      const searchConditions = {
        status:status,
        $or: [
          { title: { $regex: query, $options: 'i' } },
        ],
      };
      const restaurants = await Restaurant.find(searchConditions);  
      const restaurantWithImages = restaurants.map(restaurant => {
        restaurant.listingPhotoPaths = restaurant.listingPhotoPaths.map(photo => {
          // Directly return the correct path for the image
          return `/images/${photo.split('/').pop()}`;
        });
        return restaurant;
      });
      // console.log('here')
      res.json(restaurantWithImages);
    } catch (error) {
      console.error('Error fetching Restaurants:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  exports.getById = async (req, res) => {
    try {
      const id = req.params.id;
      const restaurant = await Restaurant.findById(id);  // This will return a single place, not an array
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      restaurant.listingPhotoPaths = restaurant.listingPhotoPaths.map(photo => {
        return `/images/${photo.split('/').pop()}`;
      })
  
      res.json(restaurant);  // Send the modified place as a response
    } catch (error) {
      console.error('Error fetching Restaurant:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  
  exports.getByUser = async (req,res) => {
    try {
  
      const id = req.params.id;
      const restaurants = await Restaurant.find({owner:id});  
  
      const listingPhotoPaths = restaurants.map(restaurant => {
        restaurant.listingPhotoPaths = restaurant.listingPhotoPaths.map(photo => {
          // Directly return the correct path for the image
          return `/images/${photo.split('/').pop()}`;
        });
        return restaurant;
      });
      res.json(listingPhotoPaths);
    } catch (error) {
      console.error('Error fetching Restaurant:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }


  exports.updateRestaurant = async (req, res) => {
    try {
      const restaurantId = req.params.id;
      if (!restaurantId) {
        return res.status(400).json({ error: 'Restaurant ID is required.' });
      }
  
      console.log('Updating Restaurant with ID:', restaurantId);
  
      const { title, description, price, address } = req.body;
  
      // Find the existing place
      const existingRestaurant = await Restaurant.findById(restaurantId);
      if (!existingRestaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      // Parse and validate address if provided
      let updatedAddress = existingRestaurant.address; // Retain current address if not provided
      let updatedCoordinates = existinghotel.coordinates;
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
        };
        updatedCoordinates = {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        };
      }
  
      // Prepare the updated data
      const updatedData = {
        title: title || existingPlace.title,
        description: description || existingPlace.description,
        price: price ? Number(price) : existingRestaurant.price,
        address: updatedAddress,
        coordinates:  updatedCoordinates ,
        listingPhotoPaths: req.files
          ? req.files.map((file) => file.path.replace(/\\/g, '/'))
          : existingPlace.listingPhotoPaths,
      };
  
      // Update the place in the database
      const updatedRestaurant = await Restaurant.updateOne({ _id: restaurantId }, updatedData);
      console.log('Update result:', updatedRestaurant);
  
      if (updatedRestaurant.matchedCount === 0) {
        return res.status(404).json({ error: 'No Restaurant found to update' });
      }
  
      res.status(200).json({
        message: 'Restaurant updated successfully',
        updatedRestaurant,
      });
    } catch (error) {
      console.error('Error updating Restaurant:', error.message);
      res.status(500).json({ error: 'Failed to update Restaurant', details: error.message });
    }
  };
  
  
  exports.deleteRestaurant = async (req,res) => {
    try {
      const restaurantId = req.params.id; // Get the place ID from the route parameter
  
      if (!restaurantId) {
        return res.status(400).json({ error: 'Restaurant ID is required' });
      }
  
      // Find the place to delete
      const restaurantToDelete = await Restaurant.find({_id:restaurantId});
      if (!restaurantToDelete) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      // Remove the place from the User's contributeList
      let ur = req.body;
      if (ur && ur._id) {
        const user = await User.findOne({ _id: ur._id });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const { ObjectId } = require('mongoose').Types;
        const RestaurantIdObject = ObjectId.isValid(restaurantId) ? new ObjectId(restaurantId) : restaurantId;
        const re = await User.updateOne(
          { _id: ur._id },
          { $pull: { contributeList: RestaurantIdObject } } // Ensure placeId is the correct type
        );
  
        if (re.modifiedCount === 0) {
          console.log('No Restaurant was removed from contributeList');
        } else {
          console.log('Restaurant removed from contributeList:', re);
        }
      }
  
      const deletedRestaurant = await Restaurant.deleteOne({_id:restaurantId});
  
      res.status(200).json({ message: 'Restaurant deleted successfully', place: deletedRestaurant });
    } catch (error) {
      console.error('Error deleting Restaurant:', error.message);
      res.status(500).json({ error: 'Failed to delete Restaurant', details: error.message });
    }
  }

  exports.changeStatus =  async (req, res) => {
    try {
      const restaurantId = req.params.id;
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'restaurant not found' });
      }
  
      // Toggle the status
      if (restaurant.status === 'Pending') {
        restaurant.status = 'approved';
      } else if (restaurant.status === 'approved') {
        restaurant.status = 'blocked';
      } else if (restaurant.status === 'blocked') {
        restaurant.status = 'approved';
      }
  
      await restaurant.save();
      res.status(200).json(restaurant);
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ message: 'Failed to update status' });
    }
  };