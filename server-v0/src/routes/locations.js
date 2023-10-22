const express = require('express');
const router = express.Router();
const locationsAPI = require('../app/controllers/LocationsAPI');

router.post('/', locationsAPI.insert);
router.get('/', locationsAPI.find);

module.exports = router;
