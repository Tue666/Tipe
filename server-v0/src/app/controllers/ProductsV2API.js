const _ = require('lodash');
const { Types } = require('mongoose');
const { Product, INVENTORY_STATUS } = require('../models/ProductV2');
const { upload, destroy } = require('../../utils/cloudinaryUpload');

const { ObjectId } = Types;

class ProductsV2API {
  // [GET] /products-v2/recommend?{{query}}
  /*
    = Query =
    categories?: String, // Id of categories separate by ","
    shop?: String (ObjectId)
    ...attribute.k?: String, // Value of attributes separate by ","
    sort?: String, // One of popular (default) | top_seller | newest | price
    direction?: Number, // One of -1 (default) | 1
    newest?: Number, // Default 0
    limit: Number,
  */
  async findForRecommend(req, res, next) {
    try {
      let { categories, shop, sort, direction, newest, limit, ...attributes } = req.query;
      categories = categories
        ? categories.split(',').map((category) => parseInt(category))
        : undefined;
      shop = shop ? ObjectId(shop) : undefined;
      switch (sort) {
        case 'top_seller':
          sort = 'quantity_sold.value';
          break;
        case 'newest':
          sort = 'updated_at';
          break;
        case 'price':
          sort = 'price';
          break;
        default:
          sort = 'created_at';
      }
      direction = direction ? parseInt(direction) : -1;
      newest = newest ? parseInt(newest) : 0;
      limit = parseInt(limit);

      const query = {
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      if (!_.isNil(categories) && categories.length > 0) {
        query['category'] = { $in: categories };
      }

      if (!_.isNil(shop)) {
        query['shop'] = { shop };
      }

      if (!_.isNil(attributes)) {
        const keys = Object.keys(attributes);
        const values = keys.map((key) => attributes[key].split(','));
        query['attributes.k'] = { $in: keys };
        query['attributes.v'] = { $in: _.flattenDepth(values, 1) };
      }

      console.log(query);
      const recommend = await Product.aggregate([
        { $match: query },
        { $sort: { [sort]: direction } },
        { $skip: newest },
        { $limit: limit },
      ]);

      res.json(recommend);
    } catch (error) {
      console.log(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /products-v2
  /*
    = Body =
		name: String,
		images: [File],
		category: Number,
		quantity: Number,
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
    try {
      const cloudinaryUploaded = [];
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
