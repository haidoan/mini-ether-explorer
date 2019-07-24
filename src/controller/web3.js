let { web3, getWeb3 } = require('../config/web3');
const abiDecoder = require('abi-decoder');
const ABI = require('../config/abi');
const ABI_ERC20 = ABI.ABI_ERC20;
abiDecoder.addABI(ABI_ERC20);
console.log('start of web3Helper', web3);

const web3Helper = {
  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  },
  async getTx(txHash) {
    try {
      // console.log('getTransaction', web3);
      if (!web3) web3 = getWeb3();
      const res = await web3.eth.getTransaction(txHash);
      return res;
    } catch (error) {
      console.log('error happen at getTransaction ', error);
    }
  },
  async getTxReceipt(txHash) {
    try {
      const res = await web3.eth.getTransactionReceipt(txHash);
      return res;
    } catch (error) {
      console.log('error happen at getTransactionReceipt ', txHash, error);
    }
  },
  async getTxBlockAndGasPriceAsync(txHash) {
    let tx;
    try {
      tx = await this.getTx(txHash);
      if (tx && tx.blockNumber && tx.gasPrice) {
        return {
          blockNumber: tx.blockNumber,
          gasPrice: tx.gasPrice
        };
      }
    } catch (error) {
      console.log('getTxBlockAndGasPriceAsync error ');
    }
  },

  async getTxInforAsync(txHash) {
    let txReceipt;
    let tx;
    let status;
    try {
      txReceipt = await this.getTxReceipt(txHash);
      // console.log('txReceipt status ', txHash, txReceipt);
      if (txReceipt !== null && txReceipt !== undefined) {
        // tx success
        tx = await this.getTx(txHash);
        // console.log('tx xxx ', tx);

        // web3 v1
        if (txReceipt.status === true) {
          status = 1;
        } else if (txReceipt.status === false) {
          status = 0;
        }
        if ((status === 1 || status === 0) && tx && tx.gasPrice && txReceipt.blockNumber) {
          txReceipt = {
            status: status,
            blockHash: txReceipt.blockHash,
            from: txReceipt.from,
            hash: txHash,
            to: txReceipt.to,
            value: parseFloat(tx.value),
            transactionIndex: txReceipt.transactionIndex,
            cumulativeGasUsed: txReceipt.cumulativeGasUsed,
            timeStamp: Math.round(new Date().getTime() / 1000),
            // gasPrice: web3.utils.fromWei(tx.gasPrice, 'ether').toString(),
            gasPrice: tx.gasPrice,
            gas: tx.gas,
            gasUsed: parseInt(txReceipt.gasUsed),
            actualTxCost: (parseInt(tx.gasPrice) * parseInt(txReceipt.gasUsed)).toString(),
            blockNumber: txReceipt.blockNumber,
            transactionHash: txReceipt.transactionHash
          };
          // console.log('txReceipt 123', txReceipt);
          return txReceipt;
        } else {
          console.log('tx or blockNumber is null  tx :', status, 'block:', txReceipt.blockNumber);
          return null;
        }
      } else {
        // console.log('txReceipt is null or undefined', txReceipt);
        return null;
      }
    } catch (error) {
      console.log('cant get tx of', txHash, ' error :', error);
      return null;
    }
  },

  async getReceiverAddresss(txHash) {
    // console.log('getReceiverAddresss of txHash ', txHash);
    // let amount;
    let count = 0;
    let isGotReceipt = false;
    try {
      let res;
      // = await web3.eth.getTransactionReceipt(txHash);
      // if (txHash === '0xd198a19893ae43d8a54791c848dc7a05a85f53054309766185a0de3ad2e52b98') {
      //   // console.log('res123', res);
      // }
      while (!isGotReceipt && count < 10) {
        res = await web3.eth.getTransactionReceipt(txHash);
        if (res) {
          if (res.status === true) {
            if (res.logs) {
              // console.log('res.log :', res);
              const log = abiDecoder.decodeLogs(res.logs);
              // console.log('log :', JSON.stringify(log, undefined, 2));
              if (log) {
                return log;
              }
            }
          } else if (res.status === false) {
            return;
          }
        }
        await this.sleep(2000);
        count++;
        console.log('count getReceiverAddresss', count, txHash);
      }
      // return { status: 'success', amount: amount };
    } catch (error) {
      console.log('error happen when getReceiverAddresss', error);
      return null;
    }
  },
  isAddress(address) {
    try {
      return web3.utils.isAddress(address);
    } catch (error) {
      console.log('error at isAddress :', error);
    }
  },
  isNormalAddress: async address => {
    try {
      if (!web3) web3 = getWeb3();
      const result = await web3.eth.getCode(address);
      if (result === '0x') return true;
    } catch (error) {
      console.log('error at isNormalAddress :', error);
    }
  },
  getLatestBlock: async () => {
    try {
      if (!web3) web3 = getWeb3();
      const block = await web3.eth.getBlockNumber();
      return block;
    } catch (error) {
      console.log(`getLatestBlock ${error}`);
    }
  },
  getBlockData: async blockNumber => {
    try {
      if (!web3) web3 = getWeb3();
      const blockData = await web3.eth.getBlock(blockNumber, true);
      return blockData;
    } catch (error) {
      console.log(`getBlockData ${error}`);
    }
  }
};

module.exports = web3Helper;
