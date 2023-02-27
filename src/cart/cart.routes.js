'use strict'

const express = require('express')
const api = express.Router();
const cartController = require('./cart.controller')
const { ensureAuth, isAdmin } = require('../services/authenticated')

api.post('/addProductCart', ensureAuth, cartController.addProductCart)

module.exports = api;