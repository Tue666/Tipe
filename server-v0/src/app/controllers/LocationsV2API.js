const mongoose = require('mongoose');

// model
const { generateSeqById } = require('../models/Counter');
const { LOCATION_SCOPES, scopes, LocationV2 } = require('../models/LocationV2');

class LocationsV2API {
  // [GET] /locations/:country
  async find(req, res, next) {
    try {
      let { country } = req.params;
      country = country.toUpperCase();
      const result = await LocationV2.aggregate([
        {
          $match: {
            code: { $regex: `^${country}-` },
            scope: { $in: LOCATION_SCOPES },
          },
        },
        {
          $facet: {
            regions: [{ $match: { scope: scopes['REGION'] } }],
            districts: [{ $match: { scope: scopes['DISTRICT'] } }],
            wards: [{ $match: { scope: scopes['WARD'] } }],
          },
        },
      ]);
      res.status(200).json(result?.[0]);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /locations-v2
  /*
    name: String,
    country: String,
    scope: 'REGION' | 'DISTRICT' | 'WARD' | 'UNSCOPED'
    [parent_id]: String,
  */
  async insert(req, res, next) {
    try {
      const { country, ...rest } = req.body;
      if (rest.parent_id) rest.parent_id = mongoose.Types.ObjectId(rest.parent_id);
      const seqCounter = await generateSeqById('location-v2');
      const code = `${country.toUpperCase()}-${seqCounter}`;
      const locationV2 = new LocationV2({
        code,
        ...rest,
      });
      await locationV2.save();
      res.status(201).json({
        msg: 'Insert location successfully!',
        location: locationV2,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new LocationsV2API();
