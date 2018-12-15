'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })
const { TABLE_SUBSCRIPTIONS } = process.env

function create (item, table = TABLE_SUBSCRIPTIONS) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Item: item
    }
    dynamodb.put(params, error => {
      if (error) return reject(error)
      resolve(item)
    })
  })
}

function get (id, table = TABLE_SUBSCRIPTIONS) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id }
    }
    dynamodb.get(params, (error, response) => {
      if (error) return reject(error)
      resolve(response.Item)
    })
  })
}

function remove (id, table = TABLE_SUBSCRIPTIONS) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { id }
    }
    dynamodb.delete(params, (error, response) => {
      if (error) return reject(error)
      resolve(response)
    })
  })
}

function list (table = TABLE_SUBSCRIPTIONS) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table
    }
    dynamodb.scan(params, (error, response) => {
      if (error) return reject(error)
      resolve(response.Items)
    })
  })
}

function publish (arn, message) {
  return new Promise((resolve, reject) => {
    new AWS.SNS().publish({
      TopicArn: arn,
      Message: message
    }, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

module.exports = {
  dynamodb: {
    create,
    get,
    remove,
    list
  },
  sns: {
    publish
  }
}
