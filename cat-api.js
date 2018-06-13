require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', function(req, res) {
  res.send('Welcome to the CATS api, meow.')
})

app.listen(
  process.env.PORT || 5555,
  process.env.HOST || '127.0.0.1',
  function() {
    console.log(
      'API is up, meow!!!',
      `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 5555}`
    )
  }
)
