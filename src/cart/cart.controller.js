'use strict'

const Product = require('../product/product.model')
const Category = require('../category/category.model')
const User = require('../user/user.model');
const Cart = require('./cart.model')
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { findOne, updateOne } = require('../product/product.model');

// ---------------------------------------------------------------

exports.addProductCart = async (req, res) => {

    let data = req.body;
    let dataUser = req.user;

    let msg = validateData(data);
    if (msg) {
        return res.status(400).send(msg)
    }

    // Buscar si el Usuario ya tiene el carrito de compras creado
    let existCart = await Cart.findOne({ user: dataUser.sub })

    //Si el carrito no existe hacer:
    if (!existCart) {

        //Crea el carrito de compras
        let cart = new Cart({ user: dataUser.sub });
        await cart.save();

        // Se agrega el producto al carrito
        let updatedCart = await Cart.findOneAndUpdate(
            { user: dataUser.sub },
            { $push: { products: { idProduct: data.idProduct, amount: data.amount } } },
            { new: true }
        )

        //Validacion si el carrito no fue encontrado
        if (!updatedCart) {
            return res.send({ message: 'The cart was not found and we could not add the products' })
        }

        //Mensaje de que el producto fue agregado al carrito de compras
        return res.send({ message: 'The products were added to the shopping cart', updatedCart })

    }

    //Validar si el producto ya fue ingresado, y si ya fue ingresado que solo aumente el numero en 'amount'
    let findProductAdded = await Cart.findOne({ user: dataUser.sub })
    let products = findProductAdded.products

    for (let i = 0; i < products.length; i++) {

        if (products[i].idProduct == data.idProduct) {

            let updatedCart = await Cart.findOneAndUpdate(
                { user: dataUser.sub, "products.idProduct": data.idProduct },
                { $inc: { "products.$.amount": data.amount } },
                { new: true }
            );

            const cart = await Cart.findOne({ user: dataUser.sub }).populate('products.idProduct');
            const totalPrice = cart.products.reduce((total, product) => {
                const price = product.idProduct.price;
                const amount = product.amount;
                return total + price * amount;
            }, 0);
            

            let updatedCart2 = await Cart.findOneAndUpdate(
                { user: dataUser.sub },
                { totalPrice: totalPrice },
                { new: true }
            );

            //Mensaje de que el producto fue agregado al carrito de compras
            return res.send({ message: 'The products were added to the shopping cart', updatedCart2 })

        }
    }

    // Se agrega el producto al carrito
    let updatedCart = await Cart.findOneAndUpdate(
        { user: dataUser.sub },
        { $push: { products: { idProduct: data.idProduct, amount: data.amount } } },
        { new: true }
    )

    const cart = await Cart.findOne({ user: dataUser.sub }).populate('products.idProduct');
    const totalPrice = cart.products.reduce((total, product) => {
        const price = product.idProduct.price;
        const amount = product.amount;
        return total + price * amount;
    }, 0);
    

    let updatedCart2 = await Cart.findOneAndUpdate(
        { user: dataUser.sub },
        { totalPrice: totalPrice },
        { new: true }
    );

    //Mensaje de que el producto fue agregado al carrito de compras
    return res.send({ message: 'The products were added to the shopping cart', updatedCart2 })

}