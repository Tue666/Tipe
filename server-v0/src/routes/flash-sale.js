const express = require('express');
const router = express.Router();
const flashSaleAPI = require('../app/controllers/FlashSaleAPI');
const upload = require('../app/middlewares/upload');

router.post('/', upload(false).array('banners', 10), flashSaleAPI.insert);
router.get('/', flashSaleAPI.find);

module.exports = router;
