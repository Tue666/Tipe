const _ = require('lodash');
const { Types } = require('mongoose');
const { Product, INVENTORY_STATUS } = require('../models/Product');
const { upload, destroy } = require('../../utils/cloudinaryUpload');
const { requireFieldSatisfied } = require('../../utils/validate');
const { findOnGoingFlashSale } = require('./FlashSaleAPI');

const { ObjectId } = Types;

const GROUP_WIDGETS = {
  top_view: 'top_view', // Default
  top_selling: 'top_selling',
  top_favorite: 'top_favorite',
  related: 'related',
};

class ProductsAPI {
  // [PATCH] /products/mark-flash-sale
  /*
    = Body =
    flash_sale_id: String as ObjectId,
    product_ids: [String as ObjectId],

  */
  async markFlashSale(req, res, next) {
    try {
      let { flash_sale_id, product_ids, ...rest } = req.body;
      if (!requireFieldSatisfied(flash_sale_id, product_ids)) {
        next({ status: 400, msg: 'Require fields are missing!' });
        return;
      }

      flash_sale_id = ObjectId(flash_sale_id);
      product_ids = product_ids.map((product_id) => ObjectId(product_id));

      const payload = {};
      const availableMarkFields = {
        limit: 'limit',
        original_price: 'original_price',
        price: 'price',
        sold: 'sold',
      };
      for (const field in rest) {
        if (availableMarkFields[field]) {
          payload[`flash_sale.$[flashSale].${field}`] = rest[field];
        }
      }

      await Product.updateMany(
        {
          _id: { $in: product_ids },
          'flash_sale.flash_sale_id': flash_sale_id,
        },
        {
          $set: payload,
        },
        {
          arrayFilters: [{ 'flashSale.flash_sale_id': flash_sale_id }],
        }
      );

      res.status(200).json({
        msg: 'Mark flash sale items successfully!',
        flash_sale_id,
        product_ids,
        payload: rest,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /products
  /*
    = Body =
		name: String,
		images: [File],
    imageUrls: [String],
		quantity?: Number,
		category: Number,
    shop?: String as ObjectId,
    ads_id?: String as ObjectId,
    is_official?: Boolean, // Default false
		[attributes]?: [{
      title: String,
      value: String,
    }],
		[specifications]?: [{
      title: String,
      value: String,
    }],
    [warranties]?: [{
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
      // let { quantity_sold, ratings, reviews } = rest;
      // rest.quantity_sold = JSON.parse(quantity_sold);
      // rest.ratings = JSON.parse(ratings);
      // rest.reviews = JSON.parse(reviews);

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
    newest?: Number, // Default 0
    limit: Number,
  */
  async findForWidget(req, res, next) {
    try {
      let { group, _id, newest, limit } = req.query;
      if (group === GROUP_WIDGETS.related && !_.isNil(_id)) {
        _id = ObjectId(_id);
      } else _id = undefined;
      newest = newest ? parseInt(newest) : 0;
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
          $facet: {
            products: [
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
              { $skip: newest },
              { $limit: limit },
            ],
            total: [
              {
                $group: {
                  _id: null,
                  totalProduct: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]);

      const { total, ...rest } = widget?.[0];
      const totalProduct = total?.[0]?.totalProduct ?? 0;
      const totalPage = Math.ceil(totalProduct / limit);
      res.status(200).json({
        ...rest,
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

  // [GET] /products/flash-sale?{{query}}
  /*
    = Query =
    flash_sale_id: String as ObjectId,
    newest?: Number, // Default 0
    limit: Number,
  */
  async findForFlashSale(req, res, next) {
    try {
      let { flash_sale_id, newest, limit } = req.query;
      let next_flash_sale = undefined;
      if (!requireFieldSatisfied(flash_sale_id)) {
        const { previous, next } = await findOnGoingFlashSale();
        if (previous.length <= 0 || next.length <= 0) {
          res.status(200).json({
            products: [],
            pagination: {
              totalPage: 0,
              currentPage: 0,
            },
          });
          return;
        }

        flash_sale_id = previous[0]._id;
        next_flash_sale = next[0].start_time;
      }

      flash_sale_id = ObjectId(flash_sale_id);
      newest = newest ? parseInt(newest) : 0;
      limit = limit ? parseInt(limit) : 1;

      const queries = {
        'flash_sale.flash_sale_id': flash_sale_id,
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      const flashSale = await Product.aggregate([
        { $match: queries },
        {
          $facet: {
            products: [
              {
                $project: {
                  name: 1,
                  images: 1,
                  flash_sale: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$flash_sale',
                          as: 'sale',
                          cond: {
                            $eq: ['$$sale.flash_sale_id', flash_sale_id],
                          },
                        },
                      },
                      0,
                    ],
                  },
                  slug: 1,
                },
              },
              { $skip: newest },
              { $limit: limit },
            ],
            total: [
              {
                $group: {
                  _id: null,
                  totalProduct: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]);

      const { total, ...rest } = flashSale?.[0];
      const totalProduct = total?.[0]?.totalProduct ?? 0;
      const totalPage = Math.ceil(totalProduct / limit);
      res.status(200).json({
        ...rest,
        next_flash_sale,
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

  // [GET] /products/suggestion?{{query}}
  /*
		= Query =
    newest?: Number, // Default 0
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

      const suggestion = await Product.aggregate([
        { $match: queries },
        {
          $facet: {
            products: [
              {
                $project: {
                  name: 1,
                  images: 1,
                  discount: 1,
                  discount_rate: 1,
                  original_price: 1,
                  price: 1,
                  quantity_sold: 1,
                  ratings: 1,
                  slug: 1,
                },
              },
              { $skip: newest },
              { $limit: limit },
            ],
            total: [
              {
                $group: {
                  _id: null,
                  totalProduct: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]);

      const { total, ...rest } = suggestion?.[0];
      const totalProduct = total?.[0]?.totalProduct ?? 0;
      const totalPage = Math.ceil(totalProduct / limit);
      res.status(200).json({
        ...rest,
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
    sort?: String, // One of popular (default) | top_selling | newest | price-asc | price-desc
    rating?: String,
    price?: String, // From and To separate by "-"
    newest?: Number, // Default 0
    limit: Number,
  */
  async findForRecommend(req, res, next) {
    try {
      let { categories, shop, sort, rating, price, newest, limit, ...attributes } = req.query;
      categories = categories
        ? categories.split(',').map((category) => parseInt(category))
        : undefined;
      shop = shop ? ObjectId(shop) : undefined;
      let direction = -1;
      switch (sort) {
        case 'top_selling':
          sort = 'quantity_sold.value';
          break;
        case 'newest':
          sort = 'updated_at';
          break;
        case 'price-asc':
        case 'price-desc':
          const [tag, order] = sort.split('-');
          sort = tag;
          direction = order === 'asc' ? 1 : -1;
          break;
        default:
          sort = 'created_at';
      }
      rating = rating ? parseInt(rating) : undefined;
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
        queries['attributes.k'] = { $all: keys };
        queries['attributes.v'] = { $all: _.flattenDepth(values, 1) };
      }

      if (!_.isNil(rating)) {
        const [from, to] = [rating - 0.9, rating];
        queries['ratings.rating_average'] = {
          $gte: from,
          $lte: to,
        };
      }

      if (!_.isNil(price)) {
        const [from, to] = price.split('-');
        queries['price'] = {
          $gte: parseInt(from),
          $lte: parseInt(to),
        };
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
              { $sort: { k: 1, v: 1 } },
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

  // [GET] /products/search?{{query}}
  /*
    = Query =
    keyword: String,
    ...attribute.k: String, // Value of attributes separate by ","
    sort?: String, // One of popular (default) | top_selling | newest | price-asc | price-desc
    rating?: String,
    price?: String, // From and To separate by "-"
    newest?: Number, // Default 0
    limit: Number,
  */
  async findForSearchKeyword(req, res, next) {
    try {
      let { keyword, sort, rating, price, newest, limit, ...attributes } = req.query;
      let direction = -1;
      keyword = keyword ? keyword : 'undefined';
      switch (sort) {
        case 'top_selling':
          sort = 'quantity_sold.value';
          break;
        case 'newest':
          sort = 'updated_at';
          break;
        case 'price-asc':
        case 'price-desc':
          const [tag, order] = sort.split('-');
          sort = tag;
          direction = order === 'asc' ? 1 : -1;
          break;
        default:
          sort = 'created_at';
      }
      rating = rating ? parseInt(rating) : undefined;
      newest = newest ? parseInt(newest) : 0;
      limit = limit ? parseInt(limit) : 1;

      const queries = {
        name: { $regex: keyword, $options: 'i' },
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };

      if (!_.isNil(attributes) && !_.isEmpty(attributes)) {
        const keys = Object.keys(attributes);
        const values = keys.map((key) => attributes[key].split(','));
        queries['attributes.k'] = { $all: keys };
        queries['attributes.v'] = { $all: _.flattenDepth(values, 1) };
      }

      if (!_.isNil(rating)) {
        const [from, to] = [rating - 0.9, rating];
        queries['ratings.rating_average'] = {
          $gte: from,
          $lte: to,
        };
      }

      if (!_.isNil(price)) {
        const [from, to] = price.split('-');
        queries['price'] = {
          $gte: parseInt(from),
          $lte: parseInt(to),
        };
      }

      const search = await Product.aggregate([
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
              { $sort: { k: 1, v: 1 } },
            ],
          },
        },
      ]);

      const { total, ...rest } = search?.[0];
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
}

module.exports = new ProductsAPI();
