'use strict'

const express = require('express')
const api = express.Router()
const productController = require('./product.controller')
const { ensureAuth, isAdmin } = require('../services/authenticated')

//Rutas privadas
api.get('/searchProducts', ensureAuth, productController.searchProducts)
api.get('/searchCategories', ensureAuth, productController.searchCategories)
// Rutas privadas solo para ADMINISTRADOR
api.get('/test', [ensureAuth, isAdmin], productController.test);
api.post('/add', [ensureAuth, isAdmin], productController.addProduct);
api.get('/get', [ensureAuth, isAdmin], productController.getProducts);
api.get('/get/:id', [ensureAuth, isAdmin],productController.getProduct)
api.delete('/delete/:id', [ensureAuth, isAdmin],productController.deleteProduct);
api.put('/update/:id', [ensureAuth, isAdmin],productController.updateProduct);

module.exports = api;