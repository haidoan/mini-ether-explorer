// const MongoClient = require('mongodb').MongoClient;
'use strict';
require('./environment');

const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const dbUrl =
  process.env.MONGO_DB_URL || 'mongodb://localhost:27017/MY_WATCHER';

console.log('object dburl', dbUrl);

const initDB = () => {
  mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true
  });
  console.log('Mongoose is connected to ', dbUrl);
};
module.exports = { ObjectID, mongoose, initDB };
