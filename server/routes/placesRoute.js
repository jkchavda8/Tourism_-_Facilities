const express = require("express");
const placeController = require('../controllers/placeController');
const router =  express.Router();

const {upload} = require('./multerConfig');

router.post('/create',upload.array('placePhotoPaths', 10), placeController.createPlace);

router.get('/user/:id',placeController.getByUser);

router.get('/place/:id',placeController.getById);
// // Get all places
router.get('/', placeController.getAllPlaces);

router.get('/admin',placeController.getAllPlaceForAdmin);

// // Update a place (with file uploads)
router.put('/update/:id',upload.array('placePhotoPaths', 10), placeController.updatePlace);

// // Delete a place
router.delete('/delete/:id', placeController.deletePlace);

router.put('/toggle-status/:id',placeController.changeStatus);

router.get('/search',placeController.searchPlaces);

router.get('/:placeId/nearByHotels',placeController.findNearbyHotelsForPlace);

router.get('/:placeId/nearByRestaurants',placeController.findNearbyRestaurantsForPlace);

module.exports = router;