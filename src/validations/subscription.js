'use strict'

const Joi = require('joi')

module.exports = {
  body: {
    url: Joi.string().regex(/^(http|https)/).required(),
    targets: Joi.array().items(Joi.object({
      label: Joi.string(),
      selector: Joi.string().required()
    })).required(),
    interval: Joi.number().required()
  }
}
