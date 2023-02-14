// const { initDB } = require('./config/db');
// const { initRedis } = require('./config/redis');
const { initRabitMQ } = require('./config/rabbitmq');
const { initWeb3 } = require('./config/web3');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const logger = require('morgan');
const port = process.env.PORT || 4000;

const api = require('./api/index');
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/', api);


async function start() {
  try {
    // initWeb3();
    await initRabitMQ();
    // initDB(); // worker only
    // initRedis();
    // const { filterAddress } = require('./helper/filter');
    server.listen(port, () => {
      console.log('server start at port ', port);
      const publisher = require('./starter/publisher');
      publisher.start();
    });
  } catch (error) {
    console.log('app is exited ', error);
    process.exit(1);
  }
}

start();
