const express = require('express')
const router = express.Router()
const db = require('../db')
const fullTime = 150


module.exports = { express, router, db, fullTime }

// to use copy
// const { express, router, db, axios } = require('./common_import')