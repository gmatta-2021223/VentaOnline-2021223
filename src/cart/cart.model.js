'use strict'
// DEFINICION DE LA ESTRUCTURA DE UNA COLECCIÓN

const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    products: {
        type: [{
            idProduct: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            amount: {
                type: Number,
                default: 0
            }
        }]
    },
    totalPrice: {
        type: Number,
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