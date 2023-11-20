const _ = require('lodash');
const { Types } = require('mongoose');
const { Order, PAYMENT_METHODS, ORDER_STATUS } = require('../models/Order');
const { Cart } = require('../models/Cart');
const { Product, INVENTORY_STATUS } = require('../models/Product');
const { fNumberWithSuffix } = require('../../utils/formatNumber');
const { findOnGoingFlashSale } = require('./FlashSaleAPI');

const { ObjectId } = Types;

class OrdersAPI {
  // [PATCH] /orders/tracking-order
  /*
    = Body =
		_id: String as ObjectId,
		status: String, // One of ORDER_STATUS
    tracking_description?: String, 
		note?: String,
	*/
  async trackingOrder(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id, status, tracking_description, ...rest } = req.body;
      _id = ObjectId(_id);
      status = status ? status.toLowerCase() : undefined;

      switch (status) {
        case ORDER_STATUS.processing.status:
        case ORDER_STATUS.transporting.status:
        case ORDER_STATUS.delivered.status:
          break;
        case ORDER_STATUS.canceled.status:
          // Canceled only when not yet transported
          const canceledOrder = await Order.findOne({
            _id,
            customer_id,
          }).select('payment_method tracking_info items');

          const { payment_method, tracking_info, items } = canceledOrder;
          if (
            tracking_info.status !==
            (ORDER_STATUS.awaiting_payment.status && ORDER_STATUS.processing.status)
          ) {
            next({ status: 400, msg: 'Canceled only when not yet processed!' });
            return;
          }

          switch (payment_method.method_key) {
            case PAYMENT_METHODS.momo:
            case PAYMENT_METHODS.vnpay:
            case PAYMENT_METHODS.international:
              // Refund goes here...
              break;
            case PAYMENT_METHODS.cash:
              break;
            default:
              break;
          }

          const onGoing = await findOnGoingFlashSale({ _id: 1 });

          // Return product quantity
          await Promise.all(
            items.map(async (item) => {
              const { _id, quantity, flash_sale_id } = item;

              const updateQueries = {
                $inc: {
                  quantity,
                  'quantity_sold.value': quantity * -1,
                },
              };

              const updateOptions = {
                new: true,
              };

              if (!_.isNil(flash_sale_id) && flash_sale_id.equals(onGoing?._id)) {
                updateQueries['$inc']['flash_sale.$[flashSale].sold'] = quantity * -1;
                updateOptions['arrayFilters'] = [{ 'flashSale.flash_sale_id': flash_sale_id }];
              }

              const updatedItem = await Product.findByIdAndUpdate(
                _id,
                updateQueries,
                updateOptions
              );
              updatedItem.quantity_sold.text =
                fNumberWithSuffix(updatedItem.quantity_sold.value, 1) + ' Sold';
              await updatedItem.save();
            })
          );

          break;
        default:
          break;
      }

      const trackingPayload = {};
      if (!_.isNil(status) && status !== '') {
        trackingPayload['tracking_info.status'] = ORDER_STATUS[status].status;
        trackingPayload['tracking_info.status_text'] = ORDER_STATUS[status].status_text;
      }

      if (!_.isNil(tracking_description) && tracking_description !== '') {
        trackingPayload['$push'] = {
          'tracking_info.tracking_list': {
            $each: [{ description: tracking_description }],
            $position: 0,
          },
        };
      }

      const order = await Order.findOneAndUpdate(
        {
          _id,
          customer_id,
        },
        {
          ...rest,
          ...trackingPayload,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        msg: 'Update order tracking status successfully!',
        order,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /orders
  /*
    = Body =
		shipping_address: {
			_id: String as ObjectId,
			name: String,
			phone_number: String,
			company?: String,
			region: String as ObjectId,
			district: String as ObjectId,
			ward: String as ObjectId,
			street: String,
			delivery_address_type: String, // One of ADDRESS_TYPES
		},
		payment_method: {
			method_key: String, // One of PAYMENT_METHODS
			method_text: String,
      message?: String,
      description?: String,
		},
		items: [
			{
				_id: String as ObjectId,
				quantity: Number,
			}
		],
		price_summary: [
			{
				name: String,
				value: Number,
			},
		],
		tracking_info?: {
			status?: String, // One of ORDER_STATUS
			status_text?: String,
      tracking_list?: [
        description: String,
        time: Date,
      ]
		},
    note?: String,
	*/
  async insert(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { items, ...restOrder } = req.body;

      const itemIds = items.map((item) => ObjectId(item._id));
      const onGoing = await findOnGoingFlashSale({ _id: 1 });
      const queries = {
        _id: { $in: itemIds },
        inventory_status: { $nin: [INVENTORY_STATUS.hidden] },
      };
      const products = await Product.aggregate([
        { $match: queries },
        {
          $project: {
            name: 1,
            images: 1,
            quantity: 1,
            flash_sale: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$flash_sale',
                    as: 'sale',
                    cond: {
                      $eq: ['$$sale.flash_sale_id', onGoing?._id ?? null],
                    },
                  },
                },
                0,
              ],
            },
            limit: 1,
            discount: 1,
            discount_rate: 1,
            original_price: 1,
            price: 1,
            inventory_status: 1,
            slug: 1,
          },
        },
      ]);

      const orderItems = [];
      const productMapping = {};
      products.map((product) => {
        const { _id, ...rest } = product;
        productMapping[_id] = {
          _id: ObjectId(_id),
          ...rest,
        };
      });

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const { _id, quantity } = item;
        const product = productMapping[_id];
        if (!_.isNil(product)) {
          const newQuantity = product.quantity - quantity;

          // Only process item is in stock
          if (newQuantity >= 0) {
            product.limit = product.flash_sale?.limit ?? product.limit;
            product.discount = product.flash_sale?.discount ?? product.discount;
            product.discount_rate = product.flash_sale?.discount_rate ?? product.discount_rate;
            product.original_price = product.flash_sale?.original_price ?? product.original_price;
            product.price = product.flash_sale?.price ?? product.price;

            if (!_.isNil(product.flash_sale)) {
              product.flash_sale_id = ObjectId(product.flash_sale.flash_sale_id);
            }

            orderItems.push({
              ...product,
              quantity,
              newQuantity,
            });
          }
        }
      }

      if (orderItems.length < 1) {
        next({ status: 400, msg: 'You have not selected any products to order yet!' });
        return;
      }

      const order = new Order({
        ...restOrder,
        customer_id,
        items: orderItems,
      });
      await order.save();

      // Remove ordered items & update product quantity
      const orderedItems = [];
      await Promise.all(
        orderItems.map(async (orderItem) => {
          const { _id, flash_sale_id, quantity, newQuantity } = orderItem;

          const updateQueries = {
            $inc: {
              quantity: quantity * -1,
              'quantity_sold.value': quantity,
            },
            $set: {},
          };

          const updateOptions = {
            new: true,
          };

          if (newQuantity === 0) updateQueries['$set']['inventory_status'] = 'out_of_stock';

          if (!_.isNil(flash_sale_id)) {
            updateQueries['$inc']['flash_sale.$[flashSale].sold'] = quantity;
            updateOptions['arrayFilters'] = [{ 'flashSale.flash_sale_id': flash_sale_id }];
          }

          const updatedItem = await Product.findByIdAndUpdate(_id, updateQueries, updateOptions);
          updatedItem.quantity_sold.text =
            fNumberWithSuffix(updatedItem.quantity_sold.value, 1) + ' Sold';
          await updatedItem.save();

          orderedItems.push(_id);
        })
      );

      await Cart.deleteMany({
        customer_id,
        product_id: { $in: orderedItems },
      });

      res.status(201).json({
        msg: 'Order is successful, please review the invoice while waiting for processing',
        _id: order._id,
        orderedItems: orderedItems.map((orderedItem) => orderedItem._id.toString()),
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /orders/:_id
  /*
    = Params =
    _id: String as ObjectId,
  */
  async findById(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id } = req.params;
      _id = ObjectId(_id);

      const order = await Order.findOne({
        _id,
        customer_id,
      });

      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /orders?{{query}}
  /*
    = Query
    status?: String, // One of ORDER_STATUS
    search?: String,
    newest?: Number,
    limit: Number,
  */
  async find(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { status, search, limit, newest } = req.query;
      newest = newest ? parseInt(newest) : 0;
      limit = limit ? parseInt(limit) : 1;

      const queries = {
        $and: [{ customer_id }],
      };

      if (typeof status !== 'undefined') {
        queries.$and.push({ 'tracking_info.status': status });
      }

      if (typeof search !== 'undefined')
        queries.$or = [
          {
            $expr: { $eq: [{ $toString: '$_id' }, search] },
          },
          { 'items.name': { $regex: search, $options: 'i' } },
        ];

      const totalProduct = await Order.count(queries);
      const totalPage = Math.ceil(totalProduct / limit);
      const orders = await Order.find(queries).sort({ updatedAt: -1 }).skip(newest).limit(limit);

      res.status(200).json({
        orders,
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
}

module.exports = new OrdersAPI();
