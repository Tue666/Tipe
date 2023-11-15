const { Schema, Types, plugin, model } = require('mongoose');
const slug = require('mongoose-slug-generator');

const { ObjectId } = Types;

const INVENTORY_STATUS = {
  available: 'available',
  out_of_stock: 'out_of_stock',
  hidden: 'hidden',
};

const Product = new Schema(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    category: { type: Number, required: true },
    shop: { type: ObjectId },
    ads_id: { type: ObjectId },
    is_official: { type: Boolean, default: false },
    flash_sale: {
      type: [
        {
          _id: false,
          flash_sale_id: { type: ObjectId, required: true },
          limit: { type: Number, min: 0, default: 0 },
          original_price: { type: Number, min: 0, default: 0 },
          price: { type: Number, min: 0, default: 0 },
          price_hidden: { type: String, default: '?' },
          sold: { type: Number, min: 0, default: 0 },
        },
      ],
      default: [],
    },
    attributes: {
      type: [
        {
          k: { type: String, required: true },
          v: { type: String, required: true },
        },
      ],
      default: [],
    },
    specifications: {
      type: [
        {
          k: { type: String, required: true },
          v: { type: String, required: true },
        },
      ],
      default: [],
    },
    warranties: {
      type: [
        {
          k: { type: String, required: true },
          v: { type: String, required: true },
        },
      ],
      default: [],
    },
    limit: { type: Number, min: 1, default: 1 },
    discount: { type: Number, min: 0, default: 0 },
    discount_rate: { type: Number, min: 0, max: 100, default: 0 },
    original_price: { type: Number, min: 0, default: 0 },
    price: { type: Number, min: 0, default: 0 },
    description: { type: String, default: '' },
    quantity_sold: {
      type: {
        _id: false,
        text: { type: String, default: '0 Sold' },
        value: { type: Number, min: 0, default: 0 },
      },
    },
    ratings: {
      rating_average: { type: Number, min: 0, default: 0 },
      rating_count: { type: Number, min: 0, default: 0 },
      scores: { type: [Number], default: [] },
    },
    reviews: {
      review_count: { type: Number, min: 0, default: 0 },
      comments: { type: Array, default: [] },
    },
    favorite_count: { type: Number, min: 0, default: 0 },
    view_count: { type: Number, min: 0, default: 0 },
    meta_description: { type: String, default: '' },
    meta_keywords: { type: String, default: '' },
    meta_title: { type: String, default: '' },
    slug: { type: String, slug: 'name', unique: true },
    inventory_status: {
      type: String,
      enum: Object.values(INVENTORY_STATUS),
      default: INVENTORY_STATUS.available,
      required: true,
    },
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

// Plugins
plugin(slug);

// Indexes
Product.index({
  'attributes.k': 1,
  'attributes.v': 1,
});

module.exports = {
  Product: model('Product', Product),
  INVENTORY_STATUS,
};
