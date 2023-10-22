const _ = require('lodash');
const { Category, CATEGORY_STATUS } = require('../models/Category');
const { upload, destroy } = require('../../utils/cloudinaryUpload');

class CategoriesAPI {
  // [POST] /categories
  /*
    = Body =
		name: String,
		image: String,
    imageUrl: String,
		banners: [String],
    bannerUrls: [String],
		parent_id: Number,
	*/
  async insert(req, res, next) {
    const cloudinaryUploaded = [];
    try {
      const { image, banners } = req.files;
      const { imageUrl, bannerUrls, ...rest } = req.body;

      // Validate a category must has one of image file or image url
      if ((_.isNil(image) || image === '') && (_.isNil(imageUrl) || imageUrl === '')) {
        next({ status: 400, msg: 'Image is required!' });
        return;
      }

      const transformedData = {
        banners: [],
      };

      // Transform image into path
      if (!_.isNil(image) && image.length > 0) {
        const { public_id } = await upload(image[0].path, { folder: 'categories' });
        transformedData['image'] = public_id;
        cloudinaryUploaded.push(public_id);
      } else if (!_.isNil(imageUrl) && imageUrl !== '') {
        transformedData['image'] = imageUrl;
      }

      // Transform banners into array string of paths
      if (!_.isNil(banners) && banners.length > 0) {
        await Promise.all(
          banners.map(async (file) => {
            const { path } = file;
            const { public_id } = await upload(path, { folder: 'banners/categories' });
            transformedData['banners'].push(public_id);
            cloudinaryUploaded.push(public_id);
          })
        );
      }

      if (!_.isNil(bannerUrls) && bannerUrls.length > 0) {
        for (let i = 0; i < bannerUrls.length; i++) {
          const bannerUrl = bannerUrls[i];
          transformedData['banners'].push(bannerUrl);
        }
      }

      const category = new Category({
        ...rest,
        ...transformedData,
      });
      await category.save();

      res.status(201).json({
        msg: 'Insert category successfully!',
        category,
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

  // [GET] /categories/:_id
  /*
    = Params =
		_id: Number
	*/
  async findById(req, res, next) {
    try {
      let { _id } = req.params;
      _id = parseInt(_id);

      const queries = {
        _id,
        status: { $nin: [CATEGORY_STATUS.inactive] },
      };

      const category = await Category.aggregate([
        { $match: queries },
        {
          // Get all parents of category
          $graphLookup: {
            from: 'categories',
            startWith: '$parent_id',
            connectFromField: 'parent_id',
            connectToField: '_id',
            as: 'parents',
          },
        },
        {
          // Get all children of category
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'children',
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
            banners: 1,
            slug: 1,
            parents: {
              _id: 1,
              name: 1,
              slug: 1,
            },
            children: {
              _id: 1,
              name: 1,
              slug: 1,
            },
          },
        },
      ]);
      res.status(200).json(category?.[0]);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /categories?{{query}}
  /*
    = Query =
    level: Number
  */
  async find(req, res, next) {
    try {
      let { level } = req.query;
      level = level ? parseInt(level) : 1;

      const queries = {
        level,
        status: { $nin: [CATEGORY_STATUS.inactive] },
      };

      const categories = await Category.find(queries).select('_id name image slug');
      res.status(200).json({
        categories,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new CategoriesAPI();
