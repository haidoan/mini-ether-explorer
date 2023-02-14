'use strict';
require('./environment');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const dbUrl = `mongodb://localhost:27017/${process.env.DB_NAME}`;

const initDB = () => {
  mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true
  });
  console.log('Mongoose is connected to ');
};
module.exports = { ObjectID, mongoose, initDB };
