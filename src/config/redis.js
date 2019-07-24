'use strict';
require('./environment');
const Redis = require('ioredis');
const PORT_REDIS = process.env.PORT_REDIS || 6379;
const AUTH_REDIS = process.env.AUTH_REDIS;
const HOST_REDIS = process.env.AUTH_REDIS || '127.0.0.1';

let client;

// // eslint-disable-next-line require-jsdoc
function getRedisClient() {
  if (!client) initRedis();
  return client;
}

const initRedis = () => {
  client = new Redis({
    host: HOST_REDIS,
    port: PORT_REDIS,
    password: AUTH_REDIS
  }); // Connect to 127.0.0.1:6379

  client.on('connect', function() {
    console.log(
      'Redis is connected to ',
      HOST_REDIS,
      ' : ',
      PORT_REDIS,
      ' at mode : ',
      process.env.NODE_ENV
    );
  });

  client.on('error', function(err) {
    console.log('Redis Something went wrong ', process.env.SERVER_NAME, err);
  });
};

module.exports = { client, getRedisClient, initRedis };
