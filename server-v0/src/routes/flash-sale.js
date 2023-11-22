const express = require('express');
const router = express.Router();
const { flashSaleAPI } = require('../app/controllers/FlashSaleAPI');
const upload = require('../app/middlewares/upload');

router.patch('/next-flash-sale', flashSaleAPI.nextFlashSale);
router.post('/', upload(false).array('banners', 10), flashSaleAPI.insert);
router.get('/sessions', flashSaleAPI.findForSessions);

module.exports = router;
