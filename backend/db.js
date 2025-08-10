const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // ใส่ port เช่น 27885
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
  connection.release(); // สำคัญ: ปล่อย connection กลับเข้า pool
});

module.exports = db;

