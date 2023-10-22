const _ = require('lodash');
const { Types } = require('mongoose');
const { Product, INVENTORY_STATUS } = require('../models/Product');
const { upload, destroy } = require('../../utils/cloudinaryUpload');

const { ObjectId } = Types;

const GROUP_WIDGETS = {
  top_view: 'top_view', // Default
  top_selling: 'top_selling',
  top_favorite: 'top_favorite',
  related: 'related',
};

class ProductsAPI {
  // [POST] /products
  /*
    = Body =
		name: String,
		images: [File],
    imageUrls: [String],
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
    const cloudinaryUploaded = [];
    try {
      const images = req.files;
      const { attributes, specifications, warranties, imageUrls, ...rest } = req.body;

      // For generate only
      let { quantity_sold, ratings, reviews } = rest;
      rest.quantity_sold = JSON.parse(quantity_sold);
      rest.ratings = JSON.parse(ratings);
      rest.reviews = JSON.parse(reviews);

      // Validate a product must has one of image files or image urls
      if (
        (_.isNil(images) || images.length === 0) &&
        (_.isNil(imageUrls) || imageUrls.length === 0)
      ) {
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

      // Transform images into array string of paths
      await Promise.all(
        images.map(async (file) => {
          const { path } = file;
          const { public_id } = await upload(path, { folder: 'products' });
          transformedData['images'].push(public_id);
          cloudinaryUploaded.push(public_id);
        })
      );

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        transformedData['images'].push(imageUrl);
      }

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

  // [GET] /products/widget?{{query}}
  /*
    = Query =
    group: String, // One of GROUP_WIDGETS
    _id: String as ObjectId, // For group related only
    limit: Number,
  */
  async findForWidget(req, res, next) {
    try {
      let { group, _id, limit } = req.query;
      if (_.isNil(group) || group === '') {
        res.status(200).json([]);
        return;
      }
      if (group === GROUP_WIDGETS.related && !_.isNil(_id)) {
        _id = ObjectId(_id);
      } else _id = undefined;
      limit = limit ? parseInt(limit) : 1;

      const GRAVITY = 1.8;
      const queries = {
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      const widget = await Product.aggregate([
        ...(_id
          ? [
              { $match: { ...queries, _id } },
              {
                $lookup: {
                  from: 'products',
                  let: { category: '$category' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $ne: ['$_id', _id] }, { $eq: ['$category', '$$category'] }],
                        },
                      },
                    },
                  ],
                  as: 'relatedProducts',
                },
              },
              { $unwind: '$relatedProducts' },
              { $replaceRoot: { newRoot: '$relatedProducts' } },
            ]
          : [{ $match: queries }]),
        {
          $addFields: {
            time_elapsed: {
              $divide: [{ $subtract: ['$$NOW', '$updated_at'] }, 3600000],
            },
          },
        },
        {
          $project: {
            name: 1,
            images: 1,
            discount: 1,
            discount_rate: 1,
            original_price: 1,
            price: 1,
            slug: 1,
            quantity_sold: 1,
            ratings: 1,
            score: {
              // HackerNews sort algorithm
              /*
        				score = voted / (t + 2)^G
        				- voted: The voted count such as sold, viewed, favorite.
        				- t: Time between post(update) time and current time (in hours).
        				- G: Constant 'gravity', default is 1.8.
        			*/
              $divide: [
                group === GROUP_WIDGETS.top_selling
                  ? '$quantity_sold.value'
                  : group === GROUP_WIDGETS.top_favorite
                  ? '$favorite_count'
                  : '$view_count', // GROUP_WIDGETS.top_view
                {
                  $pow: [{ $add: ['$time_elapsed', 2] }, GRAVITY],
                },
              ],
            },
          },
        },
        {
          $sort: {
            score: -1,
          },
        },
        { $limit: limit },
      ]);
      res.status(200).json({
        products: widget,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /products/suggestion?{{query}}
  /*
		= Query =
    newest: Number, // Default 0
    limit: Number,
	*/
  async findForSuggestion(req, res, next) {
    try {
      let { newest, limit } = req.query;
      newest = newest ? parseInt(newest) : 0;
      limit = limit ? parseInt(limit) : 1;

      const queries = {
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      const totalProduct = await Product.count(queries);
      const totalPage = Math.ceil(totalProduct / limit);
      const products = await Product.find(queries)
        .select(
          '_id name images discount discount_rate original_price price quantity_sold ratings slug'
        )
        .skip(newest)
        .limit(limit);
      res.status(200).json({
        products,
        pagination: {
          totalPage,
          currentPage: totalPage > 0 ? newest / limit + 1 : 0,
        },
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /products/recommend?{{query}}
  /*
    = Query =
    categories: String, // Id of categories separate by ","
    shop: String as ObjectId,
    ...attribute.k: String, // Value of attributes separate by ","
    sort: String, // One of popular (default) | top_selling | newest | price
    direction: Number, // One of -1 (default) | 1
    newest: Number, // Default 0
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
        case 'top_selling':
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
      limit = limit ? parseInt(limit) : 1;

      const queries = {
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      if (!_.isNil(categories) && categories.length > 0) {
        queries['category'] = { $in: categories };
      }

      if (!_.isNil(shop)) {
        queries['shop'] = { shop };
      }

      if (!_.isNil(attributes) && !_.isEmpty(attributes)) {
        const keys = Object.keys(attributes);
        const values = keys.map((key) => attributes[key].split(','));
        queries['attributes.k'] = { $in: keys };
        queries['attributes.v'] = { $in: _.flattenDepth(values, 1) };
      }

      const recommend = await Product.aggregate([
        { $match: queries },
        { $unwind: '$attributes' },
        {
          $group: {
            _id: null,
            products: {
              $addToSet: {
                _id: '$_id',
                name: '$name',
                images: '$images',
                discount: '$discount',
                discount_rate: '$discount_rate',
                original_price: '$original_price',
                price: '$price',
                slug: '$slug',
                quantity_sold: '$quantity_sold',
                ratings: '$ratings',
              },
            },
            attributes: {
              $addToSet: '$attributes',
            },
          },
        },
        {
          $facet: {
            products: [
              {
                $unwind: '$products',
              },
              {
                $replaceRoot: {
                  newRoot: '$products',
                },
              },
              { $sort: { [sort]: direction } },
              { $skip: newest },
              { $limit: limit },
            ],
            total: [
              {
                $replaceRoot: {
                  newRoot: {
                    totalProduct: { $size: '$products' },
                    totalAttribute: { $size: '$attributes' },
                  },
                },
              },
            ],
            attributes: [
              {
                $unwind: '$attributes',
              },
              {
                $replaceRoot: {
                  newRoot: '$attributes',
                },
              },
            ],
          },
        },
      ]);

      const { total, ...rest } = recommend?.[0];
      const totalProduct = total?.[0]?.totalProduct ?? 0;
      const totalPage = Math.ceil(totalProduct / limit);
      res.json({
        ...rest,
        ...total?.[0],
        pagination: {
          totalPage,
          currentPage: totalPage > 0 ? newest / limit + 1 : 0,
        },
      });
    } catch (error) {
      console.log(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /products/:_id
  /*
    = Params =
    _id: String as ObjectId,
  */
  async findById(req, res, next) {
    try {
      let { _id } = req.params;
      _id = ObjectId(_id);

      const queries = {
        _id,
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      const product = await Product.aggregate([
        { $match: queries },
        {
          $graphLookup: {
            from: 'categories',
            startWith: '$category',
            connectFromField: 'parent_id',
            connectToField: '_id',
            as: 'breadcrumbs',
          },
        },
      ]);

      res.status(200).json(product?.[0]);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /products
  async find(req, res, next) {
    try {
      res.status(200).json([]);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new ProductsAPI();
