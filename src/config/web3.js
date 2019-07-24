'use strict';
require('./environment');
const Web3 = require('web3');
let INFURA_ENDPOINT = process.env.INFURA_ENDPOINT,
  web3;

const initWeb3 = async () => {
  console.log('init web3');
  web3 = new Web3(new Web3.providers.HttpProvider(INFURA_ENDPOINT));
  console.log('Web3 is connected to ', INFURA_ENDPOINT);
  // const block = await web3.eth.getBlockNumber();
  // console.log('block', block);
  
};

const getWeb3 = () =>{
    return web3;
}
module.exports = { web3, initWeb3, getWeb3 };
