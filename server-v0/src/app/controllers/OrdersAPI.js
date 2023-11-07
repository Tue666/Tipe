const _ = require('lodash');
const { Types } = require('mongoose');
const { Order, ORDER_STATUS } = require('../models/Order');
const { Cart } = require('../models/Cart');
const { Product } = require('../models/Product');
const { fNumberWithSuffix } = require('../../utils/formatNumber');

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
          const cancelOrder = await Order.findOne({
            _id,
            customer_id,
          }).select('tracking_info items');
          if (cancelOrder.tracking_info.status !== ORDER_STATUS.processing.status) {
            next({ status: 400, msg: 'Canceled only when not yet transported!' });
            return;
          }

          // Return product quantity
          await Promise.all(
            cancelOrder.items.map(async (item) => {
              const { _id, quantity } = item;
              const product = await Product.findOne({
                _id,
              }).select('quantity quantity_sold');
              const newQuantity = product.quantity + quantity;
              const newQuantitySold = product.quantity_sold.value - quantity;
              product.quantity = newQuantity;
              product.quantity_sold.value = newQuantitySold;
              product.quantity_sold.text = fNumberWithSuffix(newQuantitySold, 1) + ' Sold';
              await product.save();
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
				name: String,
				images: [String],
				original_price: Number,
				price: Number,
				limit: Number,
				quantity: String,
				inventory_status: String, // One of INVENTORY_STATUS
				slug: String,
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
      let { items, ...rest } = req.body;
      items = items.map((item) => ({ ...item, _id: ObjectId(item._id) }));

      if (items.length < 1) {
        next({ status: 400, msg: 'You have not selected any products to order yet!' });
        return;
      }

      const order = new Order({
        ...rest,
        customer_id,
        items,
      });
      await order.save();

      // Remove ordered items & update product quantity
      let orderedItems = [];
      await Promise.all(
        items.map(async (item) => {
          const { _id, quantity } = item;

          const product = await Product.findOne({
            _id,
          }).select('quantity quantity_sold');

          const newQuantity = product.quantity - quantity;
          const newQuantitySold = product.quantity_sold.value + quantity;
          if (newQuantity >= 0) {
            product.quantity = newQuantity;
            product.quantity_sold.value = newQuantitySold;
            product.quantity_sold.text = fNumberWithSuffix(newQuantitySold, 1) + ' Sold';
            if (newQuantity <= 0) {
              product.inventory_status = 'out_of_stock';
            }

            await product.save();
            await Cart.deleteOne({
              customer_id,
              product_id: _id,
            });

            orderedItems.push(_id);
          }
        })
      );

      res.status(201).json({
        msg: 'Order is successful, please review the invoice while waiting for processing',
        _id: order._id,
        orderedItems,
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
