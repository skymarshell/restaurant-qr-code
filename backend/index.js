const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors');
const mysql = require('mysql2');
const db = require('./db');

//setting
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


//import routes
const admin = require('./routes/admin')
const category = require('./routes/category')
const food = require('./routes/food')
const customer_order = require('./routes/customer_order')
const tables = require('./routes/tables')
const dashboard = require('./routes/dashboard')


app.get('/', (req, res) => {
      res.json("Hello, world!");
});

//admin route
app.use('/admin', admin)
app.use('/category', category)
app.use('/food', food)
app.use('/customer_order', customer_order)
app.use('/tables', tables)
app.use('/dashboard', dashboard)

app.listen(port, () => {
      console.log(`app listening on port ${port} \nhttp://localhost:${port}/`)
})