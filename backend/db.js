const mysql = require("mysql2");
require("dotenv").config();

//const db = mysql.createPool(process.env.DB_CONNECTION_STRING);

const db = mysql.createPool({
<<<<<<< HEAD
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // ✅ แก้ตรงนี้
  }
=======
      host: "localhost",
      user: "root",
      password: "123456",
      database: "restaurant",
>>>>>>> parent of 9945658 (แก้ railway deploy)
});

//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       port: process.env.DB_PORT,
//       ssl:{
//             ca: sslCA,
//       }

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
<<<<<<< HEAD
  console.log("✅ Connected to MySQL database");
  connection.release();
});

//400 Bad Request:
//404 Not Found:
module.exports = db;
=======
  console.log("Connected to MySQL database");
  connection.release();
});

//200 OK:
//201 Created:
//400 Bad Request:
//404 Not Found:

module.exports = db;
>>>>>>> parent of 9945658 (แก้ railway deploy)
