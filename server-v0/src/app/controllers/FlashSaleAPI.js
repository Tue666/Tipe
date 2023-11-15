const _ = require('lodash');
const { FlashSale, FLASH_SALE_STATUS } = require('../models/FlashSale');
const { upload } = require('../../utils/cloudinaryUpload');

const LIMIT_TOTAL_UP_COMING_SESSIONS = 4;

const findOnGoingFlashSale = async () => {
  const currentTime = new Date().getTime();
  const onGoingFlashSale = await FlashSale.aggregate([
    { $match: { status: { $nin: [FLASH_SALE_STATUS.inactive] } } },
    {
      $project: {
        start_time: 1,
        banners: 1,
      },
    },
    {
      $facet: {
        previous: [
          { $match: { start_time: { $lte: currentTime } } },
          { $sort: { start_time: -1 } },
          { $addFields: { on_going: true } },
          { $limit: 1 },
        ],
        next: [
          { $match: { start_time: { $gte: currentTime } } },
          { $sort: { start_time: 1 } },
          { $addFields: { on_going: false } },
          { $limit: LIMIT_TOTAL_SESSIONS - 1 },
        ],
      },
    },
  ]);
  return onGoingFlashSale[0];
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
      const currentTime = new Date().getTime();
      const sessions = await FlashSale.aggregate([
        { $match: { status: { $nin: [FLASH_SALE_STATUS.inactive] } } },
        {
          $project: {
            start_time: 1,
            end_time: 1,
            banners: 1,
            description: 1,
          },
        },
        {
          $facet: {
            onGoing: [
              {
                $match: {
                  $and: [
                    { start_time: { $lte: currentTime } },
                    { end_time: { $gte: currentTime } },
                  ],
                },
              },
              { $addFields: { on_going: true } },
            ],
            upComing: [
              { $match: { start_time: { $gte: currentTime } } },
              { $sort: { start_time: 1 } },
              { $addFields: { on_going: false } },
              { $limit: LIMIT_TOTAL_UP_COMING_SESSIONS - 1 },
            ],
          },
        },
      ]);

      const { onGoing, upComing } = sessions?.[0];
      res.status(200).json({
        sessions: [...onGoing, ...upComing],
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
};
