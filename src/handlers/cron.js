'use strict'

const awsClient = require('../clients/aws')
const signale = require('signale')
const dayjs = require('dayjs')

module.exports = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  signale.info('Starting cron job', event)

  awsClient.dynamodb.list()
    .then(filter)
    .then(handle)
    .then(() => callback(null))
    .catch(err => {
      signale.error('Error obtaining subscriptions on schedule', err)
      callback(err)
    })
}

function filter (subscriptions) {
  signale.info('Filtering subscriptions', subscriptions)
  return new Promise((resolve, reject) => {
    if (!subscriptions || !Array.isArray(subscriptions)) {
      return reject(new Error('Subscriptions list corrupted'))
    }
    const list = subscriptions
      .filter(({ updatedAt, interval }) => {
        const sinceLastUpdate = dayjs().diff(dayjs(updatedAt), 'minutes')
        return sinceLastUpdate > interval
      })
    return resolve(list)
  })
}

function handle (subscriptions) {
  signale.info('Ready to crawl', subscriptions)
  const { IS_LOCAL } = process.env
  if (IS_LOCAL) {
    return Promise.resolve()
  }
  // TODO: publish to message queue
}
