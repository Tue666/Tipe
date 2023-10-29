const { Schema, Types, model } = require('mongoose');

const { ObjectId } = Types;

const ADDRESS_TYPES = {
  home: 'home',
  company: 'company',
};

const Address = new Schema(
  {
    customer_id: { type: ObjectId, required: true },
    name: { type: String, required: true },
    company: { type: String, default: '' },
    phone_number: { type: String, required: true },
    region_id: { type: String, required: true },
    district_id: { type: String, required: true },
    ward_id: { type: String, required: true },
    street: { type: String, required: true },
    delivery_address_type: {
      type: String,
      enum: Object.values(ADDRESS_TYPES),
      default: ADDRESS_TYPES.available,
    },
    is_default: { type: Boolean },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = {
  Address: model('Address', Address),
  ADDRESS_TYPES,
};
