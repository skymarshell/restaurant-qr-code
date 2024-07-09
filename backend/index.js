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
const category = require('./routes/category')
const food = require('./routes/food')

app.get('/', (req, res) => {
      res.json("Hello, world!");
});

//admin route
app.use('/admin', admin)
app.use('/category', category)
app.use('/food', food)

app.listen(port, () => {
      console.log(`app listening on port ${port} \nhttp://localhost:${port}/`)
})