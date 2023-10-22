const { Schema, model } = require('mongoose');

const { generateSequenceById } = require('./Counter');

const LOCATION_SCOPES = {
  REGION: 'REGION',
  DISTRICT: 'DISTRICT',
  WARD: 'WARD',
  UNSCOPED: 'UNSCOPED',
};

const Location = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  parent_id: { type: String, default: null },
  level: { type: Number, default: 1 },
  scope: {
    type: String,
    enum: Object.values(LOCATION_SCOPES),
    default: LOCATION_SCOPES.UNSCOPED,
  },
});

Location.pre('save', async function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  const sequenceCounter = await generateSequenceById('location');
  this._id = `${this._id}-${sequenceCounter}`;
  next();
});

module.exports = {
  Location: model('Location', Location),
  LOCATION_SCOPES,
};
