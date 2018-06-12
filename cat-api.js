require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', function(req, res) {
  res.send('Welcome to the CATS api, meow.')
})
