const transactionModel = require('../model/transaction');
const txController = {
  addEtherTx: tx => {
    try {
      const txPayload = {
        _id: tx.hash,
        type: 0,
        from: tx.from,
        to: tx.to,
        amount: tx.value / Math.pow(10,18),
        block: tx.blockNumber
      };
      const newTx = new transactionModel(txPayload);
      newTx.save();
    } catch (error) {
      throw error
    }
  },
  addTokenTx: txs => {
    try {
      txs.forEach(tx => {
        const txPayload = {
          _id: tx.hash,
          type: 0,
          from: tx.from,
          to: tx.to,
          amount: tx.amount,
          tokenName: tx.tokenName,
          tokenDecimal: tx.tokenDecimal,
          block: tx.blockNumber
        };
        const newTx = new transactionModel(txPayload);
        newTx.save();
      });
    } catch (error) {
      throw error
    }
  }
};

module.exports = txController;
