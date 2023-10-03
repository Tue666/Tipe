var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const LOCATION_SCOPES = ['REGION', 'DISTRICT', 'WARD'];
const DEFAULT_SCOPES = ['UNSCOPED'];

const LocationV2 = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  parent_id: { type: mongoose.Types.ObjectId, ref: 'LocationV2', default: null },
  scope: {
    type: String,
    enum: [...DEFAULT_SCOPES, ...LOCATION_SCOPES],
    default: 'UNSCOPED',
  },
});

module.exports = {
  DEFAULT_SCOPES,
  LOCATION_SCOPES,
  scopes: LOCATION_SCOPES.reduce((scopes, scope) => ({ ...scopes, [scope]: scope }), {}),
  LocationV2: mongoose.model('LocationsV2', LocationV2),
};
