const express = require('express');
const router = express.Router();
const cartsAPI = require('../app/controllers/CartsAPI');
const verifyToken = require('../app/middlewares/verifyToken');

router.put('/remove-cart', verifyToken, cartsAPI.removeCart);
router.patch('/switch-select', verifyToken, cartsAPI.switchSelect);
router.patch('/edit-quantity', verifyToken, cartsAPI.editQuantity);
router.post('/', verifyToken, cartsAPI.insert);
router.get('/', verifyToken, cartsAPI.findByCustomerId);

module.exports = router;
