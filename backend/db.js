const mysql = require('mysql2');

const db = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'world',
});


db.getConnection((err, connection) => {
      if (err) {
            console.error('Error connecting to MySQL database:', err);
            return;
      }
      console.log('Connected to MySQL database');
      connection.release();
});




module.exports = db;
