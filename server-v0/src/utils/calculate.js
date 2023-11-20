const _ = require('lodash');

const calculateDiscount = (original_price, price) => {
  original_price = !_.isNil(original_price) ? original_price : 0;
  price = !_.isNil(price) ? price : 0;

  const discount = original_price - price;
  const discount_rate = Math.round((discount / original_price) * 100);
  return { discount, discount_rate };
};

module.exports = {
  calculateDiscount,
};
