let { web3, getWeb3 } = require('../config/web3');
const abiDecoder = require('abi-decoder');
const ABI = require('../config/abi');
const ABI_ERC20 = ABI.ABI_ERC20;
abiDecoder.addABI(ABI_ERC20);

const web3Helper = {
  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  },
  async getTx(txHash) {
    try {
      if (!web3) web3 = getWeb3();
      const res = await web3.eth.getTransaction(txHash);
      return res;
    } catch (error) {
      throw error
    }
  },
  async getTxReceipt(txHash) {
    try {
      const res = await web3.eth.getTransactionReceipt(txHash);
      return res;
    } catch (error) {
      throw error
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
      throw error
    }
  },

  async getTxInforAsync(txHash) {
    let txReceipt;
    let tx;
    let status;
    try {
      txReceipt = await this.getTxReceipt(txHash);
      if (txReceipt !== null && txReceipt !== undefined) {
        tx = await this.getTx(txHash);
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
          return txReceipt;
        } else {
          console.log('tx or blockNumber is null  tx :', status, 'block:', txReceipt.blockNumber);
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      throw error
    }
  },

  async getReceiverAddresss(txHash) {
    let count = 0;
    let isGotReceipt = false;
    try {
      let res;
      while (!isGotReceipt && count < 10) {
        res = await web3.eth.getTransactionReceipt(txHash);
        if (res) {
          if (res.status === true) {
            if (res.logs) {
              const log = abiDecoder.decodeLogs(res.logs);
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
      }
    } catch (error) {
      throw error
    }
  },
  isAddress(address) {
    try {
      return web3.utils.isAddress(address);
    } catch (error) {
      throw error
    }
  },
  isNormalAddress: async address => {
    try {
      if (!web3) web3 = getWeb3();
      const result = await web3.eth.getCode(address);
      if (result === '0x') return true;
    } catch (error) {
      throw error
    }
  },
  getLatestBlock: async () => {
    try {
      if (!web3) web3 = getWeb3();
      const block = await web3.eth.getBlockNumber();
      return block;
    } catch (error) {
      throw error
    }
  },
  getBlockData: async blockNumber => {
    try {
      if (!web3) web3 = getWeb3();
      const blockData = await web3.eth.getBlock(blockNumber, true);
      return blockData;
    } catch (error) {
      throw error
    }
  }
};

module.exports = web3Helper;
