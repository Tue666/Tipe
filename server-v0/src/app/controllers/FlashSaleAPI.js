const _ = require('lodash');
const { FlashSale, FLASH_SALE_STATUS } = require('../models/FlashSale');
const { upload } = require('../../utils/cloudinaryUpload');

const SESSION_FIELDS = {
  start_time: 1,
  end_time: 1,
  banners: 1,
  description: 1,
  on_going: 1,
};
const LIMIT_TOTAL_UP_COMING_SESSIONS = 4;

const findOnGoingFlashSale = async (fields = null) => {
  const currentTime = new Date().getTime();
  const onGoingFlashSale = await FlashSale.findOne({
    on_going: { $eq: true },
    start_time: { $lte: currentTime },
    end_time: { $gte: currentTime },
    status: { $nin: [FLASH_SALE_STATUS.inactive] },
  }).select(fields || SESSION_FIELDS);

  return onGoingFlashSale;
};

const findUpComingFlashSale = async (fields = null) => {
  const currentTime = new Date().getTime();
  const upComingFlashSale = await FlashSale.find({
    on_going: { $eq: false },
    start_time: { $gte: currentTime },
    status: { $nin: [FLASH_SALE_STATUS.inactive] },
  })
    .sort({ start_time: 1 })
    .limit(LIMIT_TOTAL_UP_COMING_SESSIONS - 1)
    .select(fields || SESSION_FIELDS);

  return upComingFlashSale;
};

class FlashSaleAPI {
  // [POST] /flash-sale
  /*
    = Body =
    end_time: Number,
    banners?: [String],
    bannerUrls?: [String],
    description?: String,
  */
  async insert(req, res, next) {
    const cloudinaryUploaded = [];
    try {
      const { banners } = req.files ?? { banners: [] };
      const { end_time, bannerUrls, ...rest } = req.body;
      if (_.isNil(end_time)) {
        next({ status: 400, msg: 'End time can not be empty!' });
        return;
      }
      let start_time = end_time;

      const lastFlashSale = await FlashSale.findOne(
        {},
        { end_time: 1 },
        { sort: { end_time: -1 } }
      );
      if (!_.isNil(lastFlashSale)) {
        const { end_time: last_end_time } = lastFlashSale;
        if (last_end_time >= end_time) {
          next({
            status: 400,
            msg: `The last end time is ${new Date(last_end_time).toLocaleString()}`,
          });
          return;
        }

        start_time = last_end_time;
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
        end_time,
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

  // [GET] /flash-sale/sessions
  async findForSessions(req, res, next) {
    try {
      const onGoing = await findOnGoingFlashSale();
      const upComing = await findUpComingFlashSale();
      if (_.isNil(onGoing)) {
        res.status(200).json({
          sessions: upComing,
        });
        return;
      }

      res.status(200).json({
        sessions: [onGoing, ...upComing],
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = {
  flashSaleAPI: new FlashSaleAPI(),
  findOnGoingFlashSale,
  findUpComingFlashSale,
};
