'use strict'

const Joi = require('joi')

const schema = {
  url: Joi.string().regex(/^(http|https)/).required(),
  targets: Joi.array().items(Joi.object({
    label: Joi.string(),
    selector: Joi.string().required()
  })).required(),
  interval: Joi.number().min(15).required()
}

module.exports = {
  lambda: Object.assign({}, schema, {
    id: Joi.string().required(),
    createdAt: Joi.number().required(),
    updatedAt: Joi.number().required()
  }),
  express: { body: schema }
}
