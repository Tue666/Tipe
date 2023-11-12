const express = require('express');
const router = express.Router();
const productsAPI = require('../app/controllers/ProductsAPI');
const upload = require('../app/middlewares/upload');

router.patch('/mark-flash-sale', productsAPI.markFlashSale);
router.post('/', upload(false).array('images', 10), productsAPI.insert);
router.get('/widget', productsAPI.findForWidget);
router.get('/flash-sale', productsAPI.findForFlashSale);
router.get('/suggestion', productsAPI.findForSuggestion);
router.get('/recommend', productsAPI.findForRecommend);
router.get('/search', productsAPI.findForSearchKeyword);
router.get('/:_id', productsAPI.findById);

module.exports = router;
