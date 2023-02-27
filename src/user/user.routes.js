'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated')

// Rutas públicas
api.post('/register', userController.register )
api.post('/login', userController.login)
// Rutas privadas
api.put('/update/:id', ensureAuth, userController.updateUser)
api.delete('/delete/:id', ensureAuth, userController.deleteUser)
api.put('/updatePassword/:id', ensureAuth, userController.updatePassword)
// Rutas privadas solo para ADMINISTRADOR
api.get('/test', [ensureAuth, isAdmin], userController.test)
api.post('/save', [ensureAuth, isAdmin], userController.save)
api.put('/updateAdmin/:id', [ensureAuth, isAdmin], userController.updateUserAdmin)
api.delete('/deleteAdmin/:id', [ensureAuth, isAdmin], userController.deleteUserAdmin)


module.exports = api;