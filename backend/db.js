// const mysql = require("mysql2");
// require("dotenv").config();

// //const db = mysql.createPool(process.env.DB_CONNECTION_STRING);

// // const db = mysql.createPool({
// //       host: "localhost",
// //       user: "root",
// //       password: "123456",
// //       database: "restaurant",
// // });

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: true
//   }
// });


// //       host: process.env.DB_HOST,
// //       user: process.env.DB_USER,
// //       password: process.env.DB_PASSWORD,
// //       database: process.env.DB_DATABASE,
// //       port: process.env.DB_PORT,
// //       ssl:{
// //             ca: sslCA,
// //       }

// db.getConnection((err, connection) => {
//   if (err) {
//     console.error("Error connecting to MySQL database:", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
//   connection.release();
// });

// //200 OK:
// //201 Created:
// //400 Bad Request:
// //404 Not Found:

// module.exports = db;



// railway app
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // ✅ แก้ตรงนี้
  }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL database:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL database");
  connection.release();
});

module.exports = db;