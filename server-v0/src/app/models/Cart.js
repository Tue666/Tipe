const { Schema, Types, model } = require('mongoose');

const { ObjectId } = Types;

const Cart = new Schema(
  {
    customer_id: { type: ObjectId, required: true },
    product_id: { type: ObjectId, required: true },
    quantity: { type: Number, required: true },
    selected: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = {
  Cart: model('Cart', Cart),
};
