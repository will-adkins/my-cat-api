require('dotenv').config()
const express = require('express')
const app = express()
let database = require('./data')
const {
  find,
  isEmpty,
  propOr,
  append,
  merge,
  not,
  isNil,
  filter,
  compose
} = require('ramda')

const bodyParser = require('body-parser')
const checkRequiredFields = require('./lib/check-required-fields')
const createMissingFieldsMsg = require('./lib/create-missing-field-msg')
const cleanObj = require('./lib/clean-obj')
const nodeHTTPError = require('node-http-error')

app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.send('Welcome to the CATS api, meow.')
})

app.post('/cats', function(req, res, next) {
  const newCat = propOr({}, 'body', req)

  if (isEmpty(newCat)) {
    // No cat in request body, send the 400 response status code and message to the client.
    next(
      new nodeHTTPError(
        400,
        `missing cat in request body. use a header of 'Content-Type' with a value of 'application/json'.  Be sure to provide valid JSON to represent the cat you wish to add.`
      )
    )
    return
  }

  const missingFields = checkRequiredFields(
    ['breed', 'name', 'owner', 'age'],
    newCat
  )
  if (not(isEmpty(missingFields))) {
    // missing required fields
    next(new nodeHTTPError(400, `${createMissingFieldsMsg(missingFields)}`))
    return
  }

  const newNewCat = merge(cleanObj(['breed', 'name', 'owner', 'age'], newCat), {
    id: newCat.name,
    type: 'cat'
  })
  database = append(newNewCat, database)
  res.status(201).send({ ok: true, data: newNewCat })
})

app.get('/cats/:catname', (req, res, next) => {
  const isCat = function(obj) {
    return obj.type === 'cat'
  }

  const isCatInDatabase = (catId, database) =>
    compose(not, isNil, find(cat => cat.id === catId), filter(isCat))(database)

  isCatInDatabase(req.params.catname, database)
    ? res.send(find(cat => cat.id === req.params.catname, database))
    : next(
        new nodeHTTPError(404, 'Cat not found', {
          huh: 'dude, what are you doing?'
        })
      )

  //res.status(404).send('cat not found')
})

app.use(function(err, req, res, next) {
  console.log('TROUBLE IN RIVER CITY, meow.', err)
  next(err)
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send(err)
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
