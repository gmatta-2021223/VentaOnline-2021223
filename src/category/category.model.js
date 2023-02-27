'use strict'
// DEFINICION DE LA ESTRUCTURA DE UNA COLECCIÓN

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: 'None description'
    } 

},
{
    versionKey: false
});

module.exports = mongoose.model('Categorie', categorySchema);