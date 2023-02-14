require('../config/environment');
const rabbit = require('../config/rabbitmq');
let conn = rabbit.getRabbitInstance();
const web3Controller = require('../controller/web3');
const redisHelper = require('../controller/redis');
const BLOCK_TIME = Number(process.env.BLOCK_TIME);

/**
 * Spliting transactions to subset in order to assign to woker
 * since, there are 2 workers by default so txs will be splited into 2
 * @param {Array} txs 
 * @returns {Array} 2 sub array
 */
function getWork(txs) {
  const len = txs.length;
  const txs1 = txs.splice(0, len / 2);
  return { txs1, txs };
}

async function sendQueue(ch, queue) {
  try {
    const previosNumber = await redisHelper.get('blockNumber');
    let blockNumber = previosNumber ? previosNumber : await web3Controller.getLatestBlock();
    setInterval(async () => {
      const blockData = await web3Controller.getBlockData(blockNumber);
      if (blockData && blockData.transactions.length) {
        console.log(blockData.transactions.length);
      }

      if (blockData && blockData.transactions.length > 0) {
        if (blockData.transactions.length === 1) {
          ch.sendToQueue(queue, Buffer.from(JSON.stringify({ txs: blockData.transactions, blockNumber })), {
            persistent: true
          });
        } else {
          const { txs1, txs } = getWork(blockData.transactions);
          ch.sendToQueue(queue, Buffer.from(JSON.stringify({ txs: txs1, blockNumber })), {
            persistent: true
          });
          ch.sendToQueue(queue, Buffer.from(JSON.stringify({ txs, blockNumber })), {
            persistent: true
          });
        }
      }

      await redisHelper.set('blockNumber', blockNumber);
      blockNumber++;
    }, BLOCK_TIME);
  } catch (error) {
    console.log(`sendQueue error ${error} `);
  }
}

module.exports = {
  start: async () => {
    try {
      console.log('start listening..');
      if (!conn) conn = rabbit.getRabbitInstance();
      if (conn) {
        conn.createChannel(function(error1, channel) {
          if (error1) {
            throw error1;
          }
          const queue = 'transaction';
          channel.assertQueue(queue, {
            durable: true
          });

          sendQueue(channel, queue);
        });
      } else {
        console.log('Could not init the RabbitMQ instance');
      }
    } catch (error) {
      console.log('Could not start service ', error);
      process.exit(1)
    }
  }
};
