const express = require("express");

const router =  express.Router();
const restaurantController = require("../controllers/restaurantController")

const {upload} = require('./multerConfig');

router.post('/create',upload.array('listingPhotoPaths', 10), restaurantController.createRestaurant);

router.get('/user/:id',restaurantController.getByUser);

router.get('/restaurants/:id',restaurantController.getById);

router.get('/', restaurantController.getAllRestaurant);

router.put('/update/:id',upload.array('listingPhotoPaths', 10), restaurantController.updateRestaurant);

router.delete('/delete/:id', restaurantController.deleteRestaurant);

router.put('/toggle-status/:id',restaurantController.changeStatus);

module.exports = router;