const { Types } = require('mongoose');
const { Cart } = require('../models/Cart');
const { Product } = require('../models/Product');
const { findOnGoingFlashSale } = require('./FlashSaleAPI');

const { ObjectId } = Types;

class CartsAPI {
  // [PUT] /remove-cart (PUT replace for DELETE with body)
  /*
		_id: String as ObjectId,
	*/
  async removeCart(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id } = req.body;
      _id = !_id ? _id : ObjectId(_id);

      let result;
      // _id with null will remove all selected items
      if (!_id) {
        result = await Cart.deleteMany({ customer_id, selected: true });
      } else {
        // otherwise, remove item with _id only
        result = await Cart.deleteOne({ _id, customer_id });
      }

      res.status(200).json({
        removed: _id,
        removed_count: result.deletedCount,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [PATCH] /cart/switch-select
  /*
		_id: ObjectId as String | Boolean,
	*/
  async switchSelect(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { _id } = req.body;

      switch (typeof _id) {
        case 'boolean':
          // _id will be the value to check select all or not
          await Cart.updateMany(
            { customer_id },
            {
              selected: _id,
            }
          );
          break;
        case 'string':
          // _id of the cart item to be changed
          await Cart.findByIdAndUpdate(_id, [
            {
              $set: {
                selected: { $not: '$selected' },
              },
            },
          ]);
          break;
        default:
          break;
      }

      res.status(200).json({
        msg: 'Update select cart item successfully!',
        switched: _id,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [PATCH] /carts/edit-quantity
  /*
    = Body =
		product_id: String as ObjectId,
		new_quantity: Number,
	*/
  async editQuantity(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { product_id, new_quantity } = req.body;
      product_id = ObjectId(product_id);

      const originalProduct = await Product.findOne({ _id: product_id }).select('quantity limit');
      if (!originalProduct) {
        next({ status: 400, msg: 'Product to be added could not be found!' });
        return;
      }

      if (new_quantity > originalProduct.quantity) {
        next({
          status: 400,
          msg: `The remaining quantity of the product is ${originalProduct.quantity}`,
        });
        return;
      }
      if (new_quantity > originalProduct.limit) {
        next({
          status: 400,
          msg: `Maximum purchase quantity for this product is ${originalProduct.limit}`,
        });
        return;
      }
      if (new_quantity < 1) {
        next({ status: 400, msg: `At least 1 product` });
        return;
      }

      const cartItem = await Cart.findOneAndUpdate(
        { customer_id, product_id },
        {
          quantity: new_quantity,
        },
        {
          new: true,
          fields: '_id quantity',
        }
      );

      res.status(200).json({
        msg: 'Update cart item quantity successfully!',
        cartItem,
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [POST] /carts
  /*
    = Body =
		product_id: String as ObjectId,
		quantity: Number,
	*/
  async insert(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);
      let { product_id, quantity } = req.body;
      product_id = ObjectId(product_id);

      const onGoing = await findOnGoingFlashSale({ _id: 1 });

      const product = await Product.aggregate([
        { $match: { _id: product_id } },
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
            original_price: 1,
            price: 1,
            limit: 1,
            inventory_status: 1,
            slug: 1,
          },
        },
      ]);
      const originalProduct = product[0];
      if (!originalProduct) {
        next({ status: 400, msg: 'Product to be added could not be found!' });
        return;
      }

      let cartItem = await Cart.findOne({ customer_id, product_id });
      let newQuantity = cartItem?.quantity + quantity || quantity;
      let limit = originalProduct.flash_sale
        ? originalProduct.flash_sale.limit - originalProduct.flash_sale.sold
        : originalProduct.limit;

      if (newQuantity > originalProduct.quantity) {
        next({
          status: 400,
          msg: `The remaining quantity of the product is ${originalProduct.quantity}`,
        });
        return;
      }
      if (newQuantity > limit) {
        next({
          status: 400,
          msg: `Maximum purchase quantity for this product is ${limit}`,
        });
        return;
      }
      if (newQuantity < 1) {
        next({ status: 400, msg: `At least 1 product` });
        return;
      }

      // Update the quantity if exists
      if (cartItem) {
        cartItem.quantity = newQuantity;
        await cartItem.save();
        res.status(200).json({
          state: 'UPDATED',
          msg: 'Update cart item quantity successfully!',
          cartItem: {
            _id: cartItem._id,
            quantity: cartItem.quantity,
          },
        });
        return;
      }

      // Otherwise create a new one
      cartItem = new Cart({
        customer_id,
        product_id: originalProduct._id,
        quantity,
      });
      await cartItem.save();
      cartItem = cartItem.toObject();

      res.status(201).json({
        state: 'INSERTED',
        msg: 'Insert cart item successfully!',
        cartItem: {
          _id: cartItem._id,
          quantity: cartItem.quantity,
          selected: cartItem.selected,
          product: originalProduct,
        },
      });
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }

  // [GET] /carts
  async findByCustomerId(req, res, next) {
    try {
      let { _id: customer_id } = req.account;
      customer_id = ObjectId(customer_id);

      const onGoing = await findOnGoingFlashSale({ _id: 1 });

      const cart = await Cart.aggregate([
        {
          $match: { customer_id },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $set: {
            product: { $arrayElemAt: ['$product', 0] },
          },
        },
        {
          $project: {
            _id: 1,
            quantity: 1,
            selected: 1,
            'product._id': 1,
            'product.name': 1,
            'product.images': 1,
            'product.quantity': 1,
            'product.flash_sale': {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$product.flash_sale',
                    as: 'sale',
                    cond: {
                      $eq: ['$$sale.flash_sale_id', onGoing?._id ?? null],
                    },
                  },
                },
                0,
              ],
            },
            'product.limit': 1,
            'product.discount': 1,
            'product.discount_rate': 1,
            'product.original_price': 1,
            'product.price': 1,
            'product.inventory_status': 1,
            'product.slug': 1,
          },
        },
      ]);

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new CartsAPI();
