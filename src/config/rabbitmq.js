'use strict';
require('./environment');
const amqp = require('amqplib/callback_api');
const rabbitUserName = process.env.RABBIT_USERNAME;
const rabbitPassword = process.env.RABBIT_PASSWORD;
const rabbitHost = process.env.RABBIT_HOST;
const rabbitPort = process.env.RABBIT_PORT;
let rabbitConnectUrl = `amqp://${rabbitUserName}:${rabbitPassword}@${rabbitHost}:${rabbitPort}`;
if (process.env.NODE_ENV === 'dev') rabbitConnectUrl = 'amqp://localhost';
console.log('rabbitConnectUrl ', rabbitConnectUrl);
// amqp://user:pass@host.com/vhost
let conn;
function initRabitMQ() {
  return new Promise((resolve, reject) => {
    if (conn) resolve(null);
    amqp.connect(rabbitConnectUrl, function(err, res) {
      // amqp.connect("amqp://localhost", function(err, res) {
      if (!err) {
        conn = res;
        console.log('RabbitMQ is connected to ', rabbitConnectUrl);
        resolve(null);
      } else {
        console.log('error when initRabitMQ rabbit ', err);
        reject(err);
      }
    });
  });
}

function createChannel() {
  return new Promise((resolve, reject) => {
    conn.createChannel(function(err, ch) {
      if (!err) {
        resolve(ch);
      } else {
        reject(err);
      }
    });
  });
}

function getRabbitInstance() {
  return conn;
}
module.exports = { initRabitMQ, getRabbitInstance, createChannel };
