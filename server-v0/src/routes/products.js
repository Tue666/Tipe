const express = require('express');
const router = express.Router();
const productsAPI = require('../app/controllers/ProductsAPI');
const upload = require('../app/middlewares/upload');

router.post('/', upload(false).array('images', 10), productsAPI.insert);
router.get('/widget', productsAPI.findForWidget);
router.get('/suggestion', productsAPI.findForSuggestion);
router.get('/recommend', productsAPI.findForRecommend);
router.get('/:_id', productsAPI.findById);
router.get('/', productsAPI.find);

module.exports = router;
