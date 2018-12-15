'use strict'

const express = require('express')
const validate = require('express-validation')
const { list, create, remove } = require('../handlers/subscription')
const { express: schema } = require('../validations/subscription')
const router = express.Router()

router.get('/', list)
router.post('/', validate(schema), create)
router.delete('/:id', remove)

module.exports = router
