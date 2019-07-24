require('../config/environment');
const rabbit = require('../config/rabbitmq');
let conn = rabbit.getRabbitInstance();
const web3Controller = require('../controller/web3');
const redisHelper = require('../controller/redis');
const BLOCK_TIME = Number(process.env.BLOCK_TIME);
function getWork(txs) {
  const len = txs.length;
  const txs1 = txs.splice(0, len / 2);
  return { txs1, txs };
}

async function sendQueue(ch, queue) {
  try {
    const previosNumber = await redisHelper.get('blockNumber');
    // const previosNumber = 12385034;
    // const lastestBlockNumber =;
    let blockNumber = previosNumber ? previosNumber : await web3Controller.getLatestBlock();
    setInterval(async () => {
      // let lastestBlockNumber = 12384280;
      const blockData = await web3Controller.getBlockData(blockNumber);
      // console.log('lastestBlockNumber', lastestBlockNumber);
      console.log('blockNumber', blockNumber);
      if (blockData && blockData.transactions.length) {
        console.log(blockData.transactions.length);
      }

      if (blockData && blockData.transactions.length > 0) {
        if (blockData.transactions.length === 1) {
          ch.sendToQueue(queue, Buffer.from(JSON.stringify({ txs: blockData.transactions, blockNumber })), {
            persistent: true
          });
          // return;
        } else {
          const { txs1, txs } = getWork(blockData.transactions);
          ch.sendToQueue(queue, Buffer.from(JSON.stringify({ txs: txs1, blockNumber })), {
            persistent: true
          });
          ch.sendToQueue(queue, Buffer.from(JSON.stringify({ txs, blockNumber })), {
            persistent: true
          });
          // console.log('Sent ');
        }
      }

      await redisHelper.set('blockNumber', blockNumber);
      console.log('set block now ', blockNumber);

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
          // var msg = process.argv.slice(2).join(' ') || 'Hello World!';

          channel.assertQueue(queue, {
            durable: true
          });

          sendQueue(channel, queue);

          // channel.sendToQueue(queue, Buffer.from(msg), {
          //   persistent: true
          // });
          // console.log(' [x] Sent \'%s\'', msg);
        });

        // setTimeout(function() {
        //   conn.close();
        //   process.exit(0);
        // }, 500);
      } else {
        console.log('conn is still undefine!');
      }
    } catch (error) {
      console.log('cant start ', error);
    }
  }
};
