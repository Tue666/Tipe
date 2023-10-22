const { Schema, Types, plugin, model } = require('mongoose');
const slug = require('mongoose-slug-generator');
const { autoIncrementSequence } = require('./Counter');

const { ObjectId } = Types;

const CATEGORY_STATUS = {
  active: 'active',
  inactive: 'inactive',
};

const Category = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    image: { type: String, required: true },
    banners: { type: [String], default: [] },
    parent_id: { type: Number, default: null },
    level: { type: Number, default: 1 },
    meta_description: { type: String, default: '' },
    meta_keywords: { type: String, default: '' },
    meta_title: { type: String, default: '' },
    slug: { type: String, slug: 'name', unique: true },
    status: {
      type: String,
      enum: Object.values(CATEGORY_STATUS),
      default: CATEGORY_STATUS.active,
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
    _id: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Plugins
plugin(slug);

Category.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementSequence('category', this, next);
});

module.exports = {
  Category: model('Category', Category),
  CATEGORY_STATUS,
};
