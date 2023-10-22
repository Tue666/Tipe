const { Schema, model } = require('mongoose');

const Counter = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const CounterModel = model('Counter', Counter);

const autoIncrementSequence = async function (modelName, doc, next) {
  try {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: modelName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc._id = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
};

const generateSequenceById = async function (counterId) {
  try {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  autoIncrementSequence,
  generateSequenceById,
};
