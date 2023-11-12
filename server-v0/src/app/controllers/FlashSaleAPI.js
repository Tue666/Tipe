const _ = require('lodash');
const { FlashSale, FLASH_SALE_STATUS } = require('../models/FlashSale');
const { upload } = require('../../utils/cloudinaryUpload');

class FlashSaleAPI {
  // [POST] /flash-sale
  /*
    = Body =
    start_time: Number,
    banners?: [String],
    bannerUrls?: [String],
    description?: String,
  */
  async insert(req, res, next) {
    const cloudinaryUploaded = [];
    try {
      const { banners } = req.files ?? { banners: [] };
      const { start_time, bannerUrls, ...rest } = req.body;
      if (_.isNil(start_time)) {
        next({ status: 400, msg: 'Start time can not be empty!' });
        return;
      }

      const transformedData = {
        banners: [],
      };

      // Transform banners into array string of paths
      if (!_.isNil(banners) && banners.length > 0) {
        await Promise.all(
          banners.map(async (file) => {
            const { path } = file;
            const { public_id } = await upload(path, { folder: 'banners/flash-sale' });
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

      const flashSale = new FlashSale({
        ...rest,
        ...transformedData,
        start_time,
      });
      await flashSale.save();

      res.status(201).json({
        msg: 'Insert flash sale successfully!',
        flashSale,
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

  // [GET] /flash-sale
  async find(req, res, next) {
    try {
      const currentTime = new Date().getTime();
      const LIMIT_SESSIONS = 5;

      const queries = {
        start_time: { $gt: currentTime },
        status: { $nin: [FLASH_SALE_STATUS.inactive] },
      };

      const sessions = await FlashSale.find(queries)
        .select('_id start_time banners')
        .sort({ start_time: 1 })
        .limit(LIMIT_SESSIONS);
      res.status(200).json({
        sessions,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new FlashSaleAPI();
