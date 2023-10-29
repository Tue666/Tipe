const { Schema, Types, model } = require('mongoose');
const { generateName } = require('../../utils/generate');

const { ObjectId } = Types;

const ACCOUNT_TYPES = { customer: 'CUSTOMER', administrator: 'ADMINISTRATOR' };

const Account = new Schema(
  {
    phone_number: { type: String, required: true, unique: true },
    is_phone_verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    email: { type: String, default: '' },
    is_email_verified: { type: Boolean, default: false },
    name: { type: String, default: generateName(5) },
    avatar_url: { type: String, default: null },
    refreshToken: { type: String, default: null },
    roles: { type: [String], default: [] },
    deleted_at: { type: Date, default: null },
    deleted_by: {
      type: {
        _id: { type: ObjectId, required: true },
        name: { type: String },
      },
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    discriminatorKey: 'account_type',
  }
);
const Base = model('Account', Account);

const Customer = Base.discriminator(
  ACCOUNT_TYPES.customer,
  new Schema({
    gender: { type: String, default: '' },
    social: [
      {
        _id: false,
        id: { type: String, default: null },
        type: { type: String, default: '' },
      },
    ],
  })
);

const Administrator = Base.discriminator(ACCOUNT_TYPES.administrator, new Schema({}));

module.exports = {
  ACCOUNT_TYPES,
  Account: Base,
  Customer,
  Administrator,
};
