const { Schema, model } = require('mongoose');

const FLASH_SALE_STATUS = {
  active: 'active',
  inactive: 'inactive',
};

const FlashSale = new Schema(
  {
    start_time: { type: Number, required: true, unique: true },
    banners: { type: [String], default: [] },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(FLASH_SALE_STATUS),
      default: FLASH_SALE_STATUS.active,
      required: true,
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
  FlashSale: model('Flash-Sale', FlashSale),
  FLASH_SALE_STATUS,
};
