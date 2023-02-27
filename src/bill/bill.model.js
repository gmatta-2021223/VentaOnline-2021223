'use strict'
// DEFINICION DE LA ESTRUCTURA DE UNA COLECCIÓN

const mongoose = require('mongoose');

const billSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: {
        type: [{
            idProduct: {
                Type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            amount: {
                Type: Number,
                default: 1
            }
        }]
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

},
    {
        versionKey: false
    });

module.exports = mongoose.model('Cart', cartSchema);