const rabbit = require('../config/rabbitmq');
let conn = rabbit.getRabbitInstance();
const filter = require('../controller/filter');

function handleTxs(txs) {
  txs.forEach(tx => {
    filter.filterAddress(tx);
  });
}

async function handleRequest(ch, msg) {
  const data = JSON.parse(msg.content.toString());
  handleTxs(data.txs);
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
            handleRequest(ch, msg);
          },{ noAck: true }
        );
      });
    }
  }
};
