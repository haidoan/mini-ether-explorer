const { initDB } = require('./config/db');
const { initRedis } = require('./config/redis');
const { initRabitMQ } = require('./config/rabbitmq');
const { initWeb3 } = require('./config/web3');

const consumer = require('./starter/consumer');

async function start() {
  try {
    initWeb3();
    await initRabitMQ();
    initDB(); // worker only
    initRedis(); 
    consumer.start();
  } catch (error) {
    console.log('app is exited ', error);
    process.exit(1);
  }
}

start();
