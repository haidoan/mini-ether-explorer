const path = require('path');
module.exports = require('dotenv').config({
  path: path.join(__dirname, '../..', '.env')
});
