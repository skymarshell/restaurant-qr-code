const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const mysql = require('mysql2');
const db = require('./db');

//setting
app.use(cors());
app.use(express.json());

//import routes
const admin = require('./routes/admin')

app.get('/', (req, res) => {
      res.json("Hello, world!");
});

//admin route
app.use('/admin', admin)

app.listen(port, () => {
      console.log(`app listening on port ${port} \nhttp://localhost:${port}/`)
})