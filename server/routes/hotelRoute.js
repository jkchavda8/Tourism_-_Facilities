const express = require("express");

const router =  express.Router();
const HotelController = require("../controllers/hotelController")

const {upload} = require('./multerConfig');

router.post('/create',upload.array('listingPhotoPaths', 10), HotelController.createHotel);

router.get('/user/:id',HotelController.getByUser);

router.get('/hotels/:id',HotelController.getById);

router.get('/', HotelController.getAllHotel);

router.put('/update/:id',upload.array('listingPhotoPaths', 10), HotelController.updateHotel);

router.delete('/delete/:id', HotelController.deleteHotel);

router.put('/toggle-status/:id',HotelController.changeStatus);

module.exports = router;