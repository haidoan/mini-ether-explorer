// const redisHelper = require('./redis');
const web3Helper = require('./web3');
const txController = require('../helper/transaction');
const filterAddress = async tx => {
  // if to is smart contract
  /**
   * if to is contract
   * -> get transfer's param event
   * -> check if to is user
   * -> if yes -> save tx -> notifyToken()
   * else
   * ->check if to is user
   * -> if yes -> save tx -> notifyEth()
   */


// if(tx.value != 0){
//   console.log('tx ', tx);
//   console.log('tx hash ', tx.hash);
// }
   
  //  return;
  if (!tx) return;
  const txHash = tx.hash;
  const to = tx.to;
  if (!to) {
    console.log(`${txHash} is creation tx`);
    return;
  }
  const from = tx.from;
  const isNormalAddress = await web3Helper.isNormalAddress(to);

  if (isNormalAddress) {
    // send ether
    const amount = tx.value;
    console.log(`send ether from ${from} to ${to} amount ${amount}`);
    txController.addEtherTx(tx);
    return;
  }
  // const log = await web3Helper.getTxReceipt(txHash);
  // const log = await web3Helper.getReceiverAddresss(txHash);
  // // console.log('log', log);
  // // return;

  // if (log && log.length > 0) {
  //   const transferLog = log.filter(log => log && log.name === 'Transfer');
  //   if (transferLog && transferLog.length > 0) {
  //     transferLog.forEach(async tLog => {
  //       // console.log('tLog.events[1].value :', tLog.events[1].value);

  //       const isUser = await redisHelper.getHash('address', tLog.events[1].value.toLowerCase());
  //       if (isUser) {
  //         // save to db
  //         console.log(`${tLog.name} to ${tLog.events[1].value} amount ${tLog.events[2].value}`);
  //       }
  //     });
  //   }
  // }
};

module.exports = { filterAddress };
