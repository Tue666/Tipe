const { Types } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACCOUNT_TYPES, Account, Customer } = require('../models/Account');
const { Address } = require('../models/Address');
const { Location, LOCATION_SCOPES } = require('../models/Location');
const { generateToken } = require('../../utils/jwt');

const { ObjectId } = Types;

class AccountsAPI {
  // [DELETE] /accounts/addresses/:_id
  /*
    = Params =
    _id: String as ObjectId,
  */
  async removeAddress(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id } = req.params;
      _id = ObjectId(_id);

      const result = await Address.deleteOne({ _id, customer_id });

      res.status(200).json({
        msg: 'Remove address successfully!',
        _id,
        removed_count: result.deletedCount,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [PATCH] /accounts/addresses/switch-default/:_id
  /*
    = Params =
    _id: String as ObjectId,
  */
  async switchDefault(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id } = req.params;
      _id = ObjectId(_id);

      await Address.updateMany({ customer_id }, [
        {
          $set: {
            is_default: {
              $eq: ['$_id', _id],
            },
          },
        },
      ]);

      res.status(200).json({
        msg: 'Switch default successfully!',
        _id,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [PUT] /accounts/addresses
  /*
		_id: String as ObjectId,
		name: String,
		company: String,
		phone_number: String,
		region_id: String,
		district_id: String,
		ward_id: String,
		street: String,
		delivery_address_type: String, // One of home (default) | company
		is_default: Bool,
	*/
  async editAddress(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id, region_id, district_id, ward_id, is_default, ...rest } = req.body;
      _id = ObjectId(_id);

      // If it's default then update everything else to non-default
      if (is_default) await Address.updateMany({ customer_id }, { is_default: false });

      const address = await Address.findByIdAndUpdate(
        _id,
        {
          ...rest,
          region_id,
          district_id,
          ward_id,
          is_default,
        },
        {
          new: true,
        }
      );

      const location = await Location.aggregate([
        {
          $match: { _id: { $in: [region_id, district_id, ward_id] } },
        },
        {
          $facet: {
            region: [{ $match: { scope: LOCATION_SCOPES['REGION'] } }],
            district: [{ $match: { scope: LOCATION_SCOPES['DISTRICT'] } }],
            ward: [{ $match: { scope: LOCATION_SCOPES['WARD'] } }],
          },
        },
        {
          $project: {
            region: { $arrayElemAt: ['$region', 0] },
            district: { $arrayElemAt: ['$district', 0] },
            ward: { $arrayElemAt: ['$ward', 0] },
          },
        },
      ]);

      res.status(200).json({
        msg: 'Edit address successfully!',
        address: {
          _id: address._id,
          ...rest,
          ...location[0],
          is_default,
        },
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /accounts/addresses
  /*
		name: String,
		company: String,
		phone_number: String,
		region_id: String,
		district_id: String,
		ward_id: String,
		street: String,
		delivery_address_type: String, // One of home (default) | company
		is_default: Bool,
	*/
  async insertAddress(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { region_id, district_id, ward_id, is_default, ...rest } = req.body;

      // The first address is always default
      // otherwise if it's default then update everything else to non-default
      const addressCount = await Address.count({
        customer_id,
      });
      if (addressCount === 0) is_default = true;
      else {
        if (is_default)
          await Address.updateMany(
            {
              customer_id,
            },
            {
              is_default: false,
            }
          );
      }

      const address = new Address({
        ...rest,
        customer_id,
        region_id,
        district_id,
        ward_id,
        is_default,
      });
      await address.save();

      const location = await Location.aggregate([
        {
          $match: { _id: { $in: [region_id, district_id, ward_id] } },
        },
        {
          $facet: {
            region: [{ $match: { scope: LOCATION_SCOPES['REGION'] } }],
            district: [{ $match: { scope: LOCATION_SCOPES['DISTRICT'] } }],
            ward: [{ $match: { scope: LOCATION_SCOPES['WARD'] } }],
          },
        },
        {
          $project: {
            region: { $arrayElemAt: ['$region', 0] },
            district: { $arrayElemAt: ['$district', 0] },
            ward: { $arrayElemAt: ['$ward', 0] },
          },
        },
      ]);

      res.status(201).json({
        msg: 'Insert address successfully!',
        address: {
          _id: address._id,
          ...rest,
          ...location[0],
          is_default,
        },
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /accounts/sign-in
  /*
    = Body =
		phone_number: String,
    password: String,
	*/
  async signIn(req, res, next) {
    try {
      const { phone_number, password } = req.body;

      const account = await Account.findOne({ phone_number }).select('name password');
      if (!account) {
        next({ status: 400, msg: 'Account not found!' });
        return;
      }

      const isRightPassword = await bcrypt.compare(password, account.password);
      if (!isRightPassword) {
        next({ status: 400, msg: 'Sign in information is incorrect!' });
        return;
      }

      const { _id, name, account_type } = account;
      const tokens = generateToken({ _id, name, account_type });
      const { accessToken, refreshToken } = tokens;
      account.refreshToken = refreshToken;
      await account.save();

      res.status(200).json({
        name,
        accessToken,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /accounts/sign-up
  /*
    = Body =
		account_type: String, // One of ACCOUNT_TYPES
		phone_number: String,
		password: String,
		passwordConfirm: String,
		is_phone_verified?: Bool,
		email?: String,
		is_email_verified?: Bool,
		name?: String,
		avatar_url?: String,
		roles?: [String],
		----Customer----
		gender?: String,
		social?: [{
			id: String,
			type: String,
		}]
	*/
  async signUp(req, res, next) {
    try {
      const { phone_number, password, passwordConfirm } = req.body;

      const accountExisted = await Account.findOne({ phone_number });
      if (accountExisted) {
        next({ status: 400, msg: 'Account existed!' });
        return;
      }

      if (password !== passwordConfirm) {
        next({ status: 400, msg: 'Password not sync!' });
        return;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      let account = null;
      const details = {
        ...req.body,
        password: hashedPassword,
      };
      account = new Customer(details);
      await account.save();

      const { _id, name, account_type } = account;
      const tokens = generateToken({ _id, name, account_type });
      const { refreshToken } = tokens;
      account.refreshToken = refreshToken;
      await account.save();

      res.status(201).json({
        msg: 'Insert account successfully!',
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /accounts/verify-exist
  /*
    = Body =
		phone_number: String
	*/
  async verifyExist(req, res, next) {
    try {
      const { phone_number } = req.body;

      if (!phone_number) {
        next({ status: 400, msg: 'Phone number is required!' });
        return;
      }

      if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone_number)) {
        next({ status: 400, msg: 'Invalid phone number!' });
        return;
      }

      const account = await Account.findOne({ phone_number });

      res.status(200).json(account ? true : false);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /accounts/profile
  async getProfile(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);

      const profile = await Account.findOne({ _id: customer_id }).select('-password -refreshToken');
      const addresses = await Address.aggregate([
        { $match: { customer_id } },
        {
          $lookup: {
            from: 'locations',
            let: {
              region_id: '$region_id',
              district_id: '$district_id',
              ward_id: '$ward_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$_id', ['$$region_id', '$$district_id', '$$ward_id']] },
                },
              },
            ],
            as: 'locations',
          },
        },
        {
          $project: {
            name: 1,
            company: 1,
            phone_number: 1,
            street: 1,
            delivery_address_type: 1,
            is_default: 1,
            region: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$locations',
                    as: 'location',
                    cond: { $eq: ['$$location.scope', 'REGION'] },
                  },
                },
                0,
              ],
            },
            district: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$locations',
                    as: 'location',
                    cond: { $eq: ['$$location.scope', 'DISTRICT'] },
                  },
                },
                0,
              ],
            },
            ward: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$locations',
                    as: 'location',
                    cond: { $eq: ['$$location.scope', 'WARD'] },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $sort: { is_default: -1 },
        },
      ]);

      let dependentDetails = {};
      const account_type = profile.account_type;
      switch (account_type) {
        case ACCOUNT_TYPES.customer:
          break;
        case ACCOUNT_TYPES.administrator:
          break;
        default:
          break;
      }

      res.status(200).json({
        profile,
        addresses,
        ...dependentDetails,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /accounts/refresh-token
  async refreshToken(req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    const accessToken = authorizationHeader && authorizationHeader.split(' ')[1];
    try {
      const tokenDecoded = jwt.verify(accessToken, process.env.SECRET_SIGNATURE, {
        ignoreExpiration: true,
      });
      const account = await Account.findOne({ _id: tokenDecoded._id });
      if (!account) {
        next({ status: 400, msg: 'Token is incorrect!' });
        return;
      }

      const { _id, name, account_type } = account;
      const tokens = generateToken({ _id, name, account_type });
      account.refreshToken = tokens.refreshToken;
      await account.save();

      res.status(200).json(tokens.accessToken);
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /accounts/verify-token
  async verifyToken(req, res, next) {
    try {
      res.status(200).json(true);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new AccountsAPI();
