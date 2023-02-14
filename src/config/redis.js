'use strict';
require('./environment');
const Redis = require('ioredis');
const PORT_REDIS = process.env.PORT_REDIS;
const AUTH_REDIS = process.env.REDIS_PASSWORD;
const HOST_REDIS = process.env.HOST_REDIS;

let client;
function getRedisClient() {
  if (!client) initRedis();
  return client;
}

const initRedis = () => {
  client = new Redis({
    host: HOST_REDIS,
    port: PORT_REDIS,
    password: AUTH_REDIS
  });

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
    console.log('Redis Something went wrong ', process.env.NODE_ENV, err);
  });
};

module.exports = { client, getRedisClient, initRedis };
