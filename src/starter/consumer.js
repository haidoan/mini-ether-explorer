const rabbit = require('../config/rabbitmq');
let conn = rabbit.getRabbitInstance();

const filter = require('../controller/filter');

function handleTxs(txs) {
  txs.forEach(tx => {
    filter.filterAddress(tx);
  });
}

async function handleRequest(ch, msg) {
  // const replyQueue = "reply_" + msg.properties.timestamp;
  // const replyQueue = msg.properties.replyTo;
  // console.log("replyTo", replyTo);
  const data = JSON.parse(msg.content.toString());
  console.log('blockNumber ', data.blockNumber);
  handleTxs(data.txs);
  // send back to apihub
  // ch.sendToQueue(replyQueue, new Buffer(JSON.stringify(response)));
  // ch.ack(msg);
}

module.exports = {
  start: async () => {
    if (!conn) {
      conn = rabbit.getRabbitInstance();
    }
    if (conn) {
      conn.createChannel(function(error, ch) {
        const queue = 'transaction';

        ch.assertQueue(queue, {
          durable: true
        });
        ch.prefetch(1);
        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
        ch.consume(
          queue,
          async function(msg) {
            // console.log(
            //   " [x] %s: '%s'",
            //   msg.fields.routingKey,
            //   msg.content.toString()
            // );
            handleRequest(ch, msg);
          },
          {
            noAck: true
          }
        );
      });
    }
  }
};
