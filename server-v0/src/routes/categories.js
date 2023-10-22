const express = require('express');
const router = express.Router();
const categoriesAPI = require('../app/controllers/CategoriesAPI');
const upload = require('../app/middlewares/upload');

router.post(
  '/',
  upload(false).fields([
    { name: 'image', maxCount: 1 },
    { name: 'banners', maxCount: 5 },
  ]),
  categoriesAPI.insert
);
router.get('/:_id', categoriesAPI.findById);
router.get('/', categoriesAPI.find);

module.exports = router;
