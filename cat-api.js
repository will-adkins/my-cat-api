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
  compose,
  reject,
  propEq,
  map,
  pathOr,
  split,
  head,
  last,
  path
} = require('ramda')

const bodyParser = require('body-parser')
const checkRequiredFields = require('./lib/check-required-fields')
const createMissingFieldsMsg = require('./lib/create-missing-field-msg')
const cleanObj = require('./lib/clean-obj')
const stringToNum = require('./lib/string-to-num')
const stringToBool = require('./lib/string-to-bool')
const nodeHTTPError = require('node-http-error')

const isCat = function(obj) {
  return obj.type === 'cat'
}

const isCatInDatabase = (catId, database) =>
  compose(
    not,
    isNil,
    find(cat => cat.id === catId),
    filter(propEq('type', 'cat'))
  )(database)

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Welcome to the CATS api, meow.'))

app.get('/cats', (req, res, next) => {
  const isQueryTime = not(isNil(pathOr(null, ['query', 'filter'], req)))

  if (isQueryTime) {
    const filterArr = compose(split(':'), path(['query', 'filter']))(req)
    const filterProp = head(filterArr) // 'isDeceased'
    const filterValue = compose(stringToBool, stringToNum)(last(filterArr))
    res.send(filter(propEq(filterProp, filterValue), database))
  } else {
    console.log('im in the else')
    res.send(filter(propEq('type', 'cat'), database))
  }
})

app.get('/breeds', (req, res, next) =>
  res.send(filter(propEq('type', 'breed'), database))
)

app.delete('/cats/:catname', function(req, res, next) {
  if (isCatInDatabase(req.params.catname, database)) {
    database = reject(cat => cat.id === req.params.catname, database)
    res.status(200).send('cat deleted')
  } else {
    next(new nodeHTTPError(404, 'Cat not found'))
  }
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
  isCatInDatabase(req.params.catname, database)
    ? res.send(find(cat => cat.id === req.params.catname, database))
    : next(
        new nodeHTTPError(404, 'Cat not found', {
          huh: 'dude, what are you doing?'
        })
      )
})

app.put('/cats/:catname', function(req, res, next) {
  // TODO: DONE No cat in request body, send the 400 response status code and message to the client.
  // TODO: DONE Missing required fields send 400 response
  // TODO: DONE Clean unnecessary prop
  // TODO: id prop value in resource matches the name within in route/path

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
    ['id', 'type', 'breed', 'name', 'owner', 'age'],
    newCat
  )

  if (not(isEmpty(missingFields))) {
    // missing required fields
    next(new nodeHTTPError(400, `${createMissingFieldsMsg(missingFields)}`))
    return
  }

  if (not(propEq('id', req.params.catname, newCat))) {
    // something is wrong send a 400
    next(
      new nodeHTTPError(
        400,
        `The id of the cat in the URI path does not match the id property value. Ensure the id of the cat in the URI and the id value match and resend the request.`
      )
    )
    return
  }

  const newNewCat = cleanObj(
    ['breed', 'name', 'owner', 'age', 'id', 'type'],
    newCat
  )

  if (isCatInDatabase(req.params.catname, database)) {
    database = map(
      obj =>
        obj.id === req.params.catname && obj.type === 'cat' ? newNewCat : obj,
      database
    )
    res.status(200).send('the cat was updated.')
  } else {
    next(
      new nodeHTTPError(404, 'Cat not found', {
        huh: 'dude, what are you doing?'
      })
    )
  }
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
