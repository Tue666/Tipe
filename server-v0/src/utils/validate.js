const _ = require('lodash');

const requireFieldSatisfied = (...fields) => {
  return fields.every((field) => !_.isNil(field));
};

module.exports = {
  requireFieldSatisfied,
};
