const _ = require('lodash');
const Product = require('../models/ProductV2');
const { upload, destroy } = require('../../utils/cloudinaryUpload');

class ProductsV2API {
  // [POST] /products-v2
  /*
		name: String,
		images: [File],
		quantity: Number,
		category: Number,
		[attributes]: [{
      title: String,
      value: String,
    }],
		[specifications]: [{
      title: String,
      value: String,
    }],
    [warranties]: [{
      title: String,
      value: String,
    }],
		...
	*/
  async insert(req, res, next) {
    const cloudinaryUploaded = [];
    try {
      const images = req.files;
      const { attributes, specifications, warranties, ...rest } = req.body;

      // Validate images
      if (_.isNil(images) || images.length === 0) {
        next({ status: 400, msg: 'Images are required!' });
        return;
      }

      const transformedData = {
        images: [],
        attributes: [],
        specifications: [],
        warranties: [],
      };

      // Transform attributes into array of key value pairs
      if (!_.isNil(attributes) && attributes.length > 0) {
        attributes.map((attribute) => {
          const { title, value } = JSON.parse(attribute);
          transformedData['attributes'].push({
            k: title,
            v: value,
          });
        });
      }

      // Transform specifications into array of key value pairs
      if (!_.isNil(specifications) && specifications.length > 0) {
        specifications.map((specification) => {
          const { title, value } = JSON.parse(specification);
          transformedData['specifications'].push({
            k: title,
            v: value,
          });
        });
      }

      // Transform warranties into array of key value pairs
      if (!_.isNil(warranties) && warranties.length > 0) {
        warranties.map((warranty) => {
          const { title, value } = JSON.parse(warranty);
          transformedData['warranties'].push({
            k: title,
            v: value,
          });
        });
      }

      // Transform file of images into array string of paths
      await Promise.all(
        images.map(async (file) => {
          const { path } = file;
          const { public_id } = await upload(path, { folder: 'product' });
          transformedData['images'].push(public_id);
          cloudinaryUploaded.push(public_id);
        })
      );

      const product = new Product({
        ...rest,
        ...transformedData,
      });
      await product.save();

      res.status(201).json({
        msg: 'Insert product successfully!',
        product,
      });
    } catch (error) {
      console.error(error);

      // Remove images were uploaded to cloudinary when insert failed
      if (cloudinaryUploaded.length > 0) {
        await Promise.all(
          cloudinaryUploaded.map(async (image) => {
            await destroy(image);
          })
        );
      }

      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new ProductsV2API();
