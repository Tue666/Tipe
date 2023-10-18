const express = require('express');
const router = express.Router();
const productsV2API = require('../app/controllers/ProductsV2API');
const upload = require('../app/middlewares/upload');

router.post('/', upload(false).array('images', 10), productsV2API.insert);
router.get('/recommend', productsV2API.findForRecommend);

module.exports = router;
