const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const mysql = require('mysql2');
const db = require('./db');

app.use(cors());




app.get('/', (req, res) => {
      // db.query('SELECT * FROM city', (err, result) => {
      //       if (err) {
      //             console.error('Error executing query:', err);
      //             res.status(500).send('Internal Server Error');
      //             return;
      //       }
      //       res.json(result);
      // });
      res.json("Hello, world!");
});

app.listen(port, () => {
      console.log(`app listening on port ${port} \nhttp://localhost:3000/`)
})