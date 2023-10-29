const { Schema, Types, model } = require('mongoose');
const { ADDRESS_TYPES } = require('./Address');
const { INVENTORY_STATUS } = require('./Product');

const { ObjectId } = Types;

const PAYMENT_METHODS = {
  cash: 'cash',
  momo: 'momo',
  vnpay: 'vnpay',
  international: 'international',
};

const ORDER_STATUS = {
  awaiting_payment: 'awaiting_payment',
  processing: 'processing',
  transporting: 'transporting',
  delivered: 'delivered',
  canceled: 'canceled',
};

const Order = new Schema(
  {
    customer_id: { type: ObjectId, required: true },
    shipping_address: {
      _id: { type: ObjectId, required: true },
      name: { type: String, required: true },
      phone_number: { type: String, required: true },
      company: { type: String },
      region: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
      street: { type: String, required: true },
      delivery_address_type: {
        type: String,
        enum: Object.values(ADDRESS_TYPES),
        required: true,
      },
    },
    payment_method: {
      method_key: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
        required: true,
      },
      method_text: { type: String, required: true },
      message: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    items: [
      {
        _id: { type: ObjectId, required: true },
        name: { type: String, required: true },
        images: [{ type: String, required: true }],
        original_price: { type: Number, required: true },
        price: { type: Number, required: true },
        limit: { type: Number, required: true },
        quantity: { type: Number, required: true },
        inventory_status: {
          type: String,
          enum: Object.values(INVENTORY_STATUS),
          required: true,
        },
        slug: { type: String, required: true },
      },
    ],
    price_summary: {
      type: [
        {
          _id: false,
          name: { type: String, required: true },
          value: { type: Number, required: true },
        },
      ],
      default: [],
    },
    tracking_info: {
      status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.processing,
      },
      status_text: { type: String, default: 'Pending processing' },
      tracking_list: {
        type: [
          {
            _id: false,
            description: { type: String, required: true },
            time: { type: Date, default: Date.now },
          },
        ],
        default: [
          {
            description: 'Order placed',
            time: Date.now(),
          },
        ],
      },
    },
    note: { type: String, default: '' },
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
  }
);

module.exports = {
  Order: model('Order', Order),
  PAYMENT_METHODS,
  ORDER_STATUS,
};
