const express = require('express')
const router = express.Router()
const db = require('../db')



module.exports = { express, router, db }

// to use copy
// const { express, router, db, axios } = require('./common_import')