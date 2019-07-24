const mongoose = require('mongoose');
// const validator = require('validator')
const transaction = new mongoose.Schema({
  _id: { type: String, uniqued: true, index: 1 },
  type: { type: Number, required: true, index: 1 },
  from: { type: String, required: true, index: 1 },
  to: { type: String, required: true, index: 1 },
  amount: { type: Number, required: true },
  tokenAdress: { type: String, index: 1 },
  tokenName: { type: String },
  tokenDecimal: { type: Number },
  block: { type: Number, required: true }
});

module.exports = mongoose.model('Transaction', transaction);
