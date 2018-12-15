'use strict'

const uuid = require('uuid')
const signale = require('signale')
const awsClient = require('../clients/aws')

function list (req, res) {
  signale.info('Listing subscriptions')

  awsClient.dynamodb.list()
    .then(data => res.status(200).json(data))
    .catch(err => {
      signale.debug('Error getting subscriptions', err)
      res.status(500).end()
    })
}

function create (req, res) {
  signale.info('Creating new subscription', req.body)
  const timestamp = new Date().getTime()
  const { url, targets, interval } = req.body
  const id = uuid.v1()
  const subscription = {
    id,
    url,
    targets,
    interval,
    createdAt: timestamp,
    updatedAt: timestamp
  }
  signale.info('New subscription created', subscription)

  awsClient.dynamodb.create(subscription)
    .then(data => res.status(200).json(data))
    .catch(err => {
      signale.debug('Error creating subscription', err)
      res.status(500).end()
    })
}

function remove (req, res) {
  signale.info('Removing subscription', req.params)
  const id = req.params.id

  awsClient.dynamodb.remove(id)
    .then(() => {
      res.status(200).json({ id })
    }).catch(err => {
      signale.debug(`Error removing subscription: ${id}`, err)
      res.status(500).end()
    })
}

module.exports = {
  list,
  create,
  remove
}
