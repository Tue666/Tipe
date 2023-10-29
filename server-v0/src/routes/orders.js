const express = require('express');
const router = express.Router();
const ordersAPI = require('../app/controllers/OrdersAPI');
const verifyToken = require('../app/middlewares/verifyToken');

router.post('/', verifyToken, ordersAPI.insert);
router.get('/:_id', ordersAPI.findById);
router.get('/', verifyToken, ordersAPI.find);

module.exports = router;
