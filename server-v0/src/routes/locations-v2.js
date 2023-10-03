const express = require('express');
const router = express.Router();

// controllers
const locationsV2API = require('../app/controllers/LocationsV2API');

router.post('/', locationsV2API.insert);
router.get('/:country', locationsV2API.find);

module.exports = router;
