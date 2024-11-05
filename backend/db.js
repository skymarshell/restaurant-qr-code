const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: '3306'
});


db.getConnection((err, connection) => {
      if (err) {
            console.error('Error connecting to MySQL database:', err);
            return;
      }
      console.log('Connected to MySQL database');
      connection.release();
});


//200 OK:
//201 Created:
//400 Bad Request:
//404 Not Found:

module.exports = db;
