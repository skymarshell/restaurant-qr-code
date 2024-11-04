const mysql = require('mysql2');

const db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '161718',
      database: 'restaurant',
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
