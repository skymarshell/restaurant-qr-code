const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "restaurant",
      // host: process.env.HOST,
      // user: process.env.USER,
      // password: process.env.PASSWORD,
      // database: process.env.DATABASE,
      // port: process.env.DB_PORT
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
