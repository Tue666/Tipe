const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const { generateName } = require('../../utils/generate');

const Types = { customer: 'CUSTOMER', administrator: 'ADMINISTRATOR' };

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
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    discriminatorKey: 'account_type',
  }
);
const Base = mongoose.model('Account', Account);

const Customer = Base.discriminator(
  Types.customer,
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

const Administrator = Base.discriminator(Types.administrator, new Schema({}));

Account.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  deletedByType: {
    name: { type: String },
  },
  overrideMethods: true,
});

module.exports = {
  Types,
  Account: Base,
  Customer,
  Administrator,
};
