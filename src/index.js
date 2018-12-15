'use strict'

const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const signale = require('signale')
const router = require('./routers/subscription')
const cronHandler = require('./handlers/cron')
const scrapeHandler = require('./handlers/scrape')
const app = express()

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.use(morgan('combined'))
app.use('/api/subscriptions', router)

app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  signale.fatal(err)
  res.status(400).json('Bad Request')
})

module.exports = {
  api: serverless(app),
  cron: cronHandler,
  scrape: scrapeHandler
}
