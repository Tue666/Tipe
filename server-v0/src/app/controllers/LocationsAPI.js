const _ = require('lodash');
const { Types } = require('mongoose');

const { ObjectId } = Types;

const { Location, LOCATION_SCOPES } = require('../models/Location');

class LocationsAPI {
  // [POST] /locations
  /*
    = Body =
    name: String,
    parent_id: String,
    level: String,
    scope: String, // One of LOCATION_SCOPES
    country: String,
  */
  async insert(req, res, next) {
    try {
      let { country } = req.body;
      if (_.isNil(country) || country === '') {
        next({ status: 400, msg: 'Country is required!' });
        return;
      }
      country = country.toUpperCase();

      const location = new Location({
        ...req.body,
        _id: country,
      });
      await location.save();

      res.status(201).json({
        msg: 'Insert location successfully!',
        location: location,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /locations?{{query}}
  /*
    = Query =
    country: String
  */
  async find(req, res, next) {
    try {
      let { country } = req.query;

      const queries = {
        scope: {
          $in: Object.values(LOCATION_SCOPES).filter((scope) => scope !== LOCATION_SCOPES.UNSCOPED),
        },
      };

      if (!_.isNil(country) && country !== '') {
        country = country.toUpperCase();
        queries['_id'] = { $regex: `^${country}-` };
      }

      const locations = await Location.aggregate([
        { $match: queries },
        {
          $facet: {
            regions: [{ $match: { scope: LOCATION_SCOPES.REGION } }],
            districts: [{ $match: { scope: LOCATION_SCOPES.DISTRICT } }],
            wards: [{ $match: { scope: LOCATION_SCOPES.WARD } }],
          },
        },
      ]);
      res.status(200).json(locations?.[0]);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new LocationsAPI();
