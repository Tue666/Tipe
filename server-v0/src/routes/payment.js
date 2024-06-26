const express = require('express');
const router = express.Router();
const paymentAPI = require('../app/controllers/PaymentAPI');
const verifyToken = require('../app/middlewares/verifyToken');

router.post('/momo/ipn', verifyToken, paymentAPI.momoIPNCallback);
router.post('/momo/create', verifyToken, paymentAPI.momoCreate);
router.get('/vnpay/ipn', verifyToken, paymentAPI.vnpayIPNCallback);
router.post('/vnpay/create', verifyToken, paymentAPI.vnpayCreate);

module.exports = router;
