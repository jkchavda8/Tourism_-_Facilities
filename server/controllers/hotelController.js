const User = require('../models/User');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Hotel = require('../models/Hotels');

exports.createHotel = async (req, res) => {
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

      const newHotel = new Hotel({
        title,
        description,
        price: price ? Number(price) : 0,
        address: addressData,
        owner: st,
        listingPhotoPaths: req.files ? req.files.map((file) => file.path.replace(/\\/g, '/')) : [],
        coordinates: coordinatesData
      });
  
      const savedHotel = await newHotel.save();
  
      if (or) {
        // console.log(st);
        await User.updateOne({ _id: st }, { $push: { contributeList: savedHotel._id } });
      }
      // console.log(req.body)
      res.status(201).json({ message: 'Hotel created successfully', hotel: savedHotel });
    } catch (error) {
      console.error('Error creating Hotel:', error.message);
      res.status(500).json({ error: 'Failed to create Hotel', details: error.message });
    }
  };

  exports.getAllHotel = async (req, res) => {
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
      const hotels = await Hotel.find(searchConditions);  
      const hotelWithImages = hotels.map(hotel => {
        hotel.listingPhotoPaths = hotel.listingPhotoPaths.map(photo => {
          // Directly return the correct path for the image
          return `/images/${photo.split('/').pop()}`;
        });
        return hotel;
      });
      res.json(hotelWithImages);
    } catch (error) {
      console.error('Error fetching Hotels:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  exports.getById = async (req, res) => {
    try {
      const id = req.params.id;
      const hotel = await Hotel.findById(id);  // This will return a single place, not an array
  
      if (!hotel) {
        return res.status(404).json({ message: 'hotel not found' });
      }
  
      hotel.listingPhotoPaths = hotel.listingPhotoPaths.map(photo => {
        return `/images/${photo.split('/').pop()}`;
      })
  
      res.json(hotel);  // Send the modified place as a response
    } catch (error) {
      console.error('Error fetching hotel:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  
  exports.getByUser = async (req,res) => {
    try {
  
      const id = req.params.id;
      const hotels = await Hotel.find({owner:id});  
  
      const listingPhotoPaths = hotels.map(hotel => {
        hotel.listingPhotoPaths = hotel.listingPhotoPaths.map(photo => {
          // Directly return the correct path for the image
          return `/images/${photo.split('/').pop()}`;
        });
        return hotel;
      });
      res.json(listingPhotoPaths);
    } catch (error) {
      console.error('Error fetching places:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }


  exports.updateHotel = async (req, res) => {
    try {
      const hotelId = req.params.id;
      if (!hotelId) {
        return res.status(400).json({ error: 'hotel ID is required.' });
      }
  
      console.log('Updating hotel with ID:', hotelId);
  
      const { title, description, price, address } = req.body;
  
      // Find the existing place
      const existinghotel = await Hotel.findById(hotelId);
      if (!existinghotel) {
        return res.status(404).json({ error: 'hotel not found' });
      }
  
      // Parse and validate address if provided
      let updatedAddress = existinghotel.address; // Retain current address if not provided
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
        price: price ? Number(price) : existinghotel.price,
        address: updatedAddress,
        coordinates:  updatedCoordinates ,
        listingPhotoPaths: req.files
          ? req.files.map((file) => file.path.replace(/\\/g, '/'))
          : existingPlace.listingPhotoPaths,
        
      };
  
      // Update the place in the database
      const updatedHotel = await Hotel.updateOne({ _id: hotelId }, updatedData);
      console.log('Update result:', updatedHotel);
  
      if (updatedHotel.matchedCount === 0) {
        return res.status(404).json({ error: 'No hotel found to update' });
      }
  
      res.status(200).json({
        message: 'hotel updated successfully',
        updatedHotel,
      });
    } catch (error) {
      console.error('Error updating hotel:', error.message);
      res.status(500).json({ error: 'Failed to update hotel', details: error.message });
    }
  };
  
  
  exports.deleteHotel = async (req,res) => {
    try {
      const hotelId = req.params.id; // Get the place ID from the route parameter
  
      if (!hotelId) {
        return res.status(400).json({ error: 'hotel ID is required' });
      }
  
      // Find the place to delete
      const hotelToDelete = await Hotel.find({_id:hotelId});
      if (!hotelToDelete) {
        return res.status(404).json({ error: 'hotel not found' });
      }
  
      // Remove the place from the User's contributeList
      let ur = req.body;
      if (ur && ur._id) {
        const user = await User.findOne({ _id: ur._id });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const { ObjectId } = require('mongoose').Types;
        const hotelIdObject = ObjectId.isValid(hotelId) ? new ObjectId(hotelId) : hotelId;
        const re = await User.updateOne(
          { _id: ur._id },
          { $pull: { contributeList: hotelIdObject } } // Ensure placeId is the correct type
        );
  
        if (re.modifiedCount === 0) {
          console.log('No hotel was removed from contributeList');
        } else {
          console.log('hotel removed from contributeList:', re);
        }
      }
  
      const deletedHotel = await Hotel.deleteOne({_id:hotelId});
  
      res.status(200).json({ message: 'Hotel deleted successfully', place: deletedHotel });
    } catch (error) {
      console.error('Error deleting hotel:', error.message);
      res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
    }
  }

  exports.changeStatus =  async (req, res) => {
    try {
      const hotelId = req.params.id;
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: 'hotel not found' });
      }
  
      // Toggle the status
      if (hotel.status === 'Pending') {
        hotel.status = 'approved';
      } else if (hotel.status === 'approved') {
        hotel.status = 'blocked';
      } else if (hotel.status === 'blocked') {
        hotel.status = 'approved';
      }
  
      await hotel.save();
      res.status(200).json(hotel);
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ message: 'Failed to update status' });
    }
  };