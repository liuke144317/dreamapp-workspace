const mysql = require('mysql')
const config = require('../config.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
  charset  : config.database.CHARSET
});

module.exports = pool
