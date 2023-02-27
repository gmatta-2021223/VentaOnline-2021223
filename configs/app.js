'use strict'

//const bcrypt = require('bcrypt');
const cors = require('cors');
//const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3500;
const userRoutes = require('../src/user/user.routes')
const categoryRoutes = require('../src/category/category.routes')
const productRoutes = require('../src/product/product.routes')
const cartRoutes = require('../src/cart/cart.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/user', userRoutes)
app.use('/category',categoryRoutes); //Express que existe un conjunto de rutas
app.use('/product', productRoutes); // Ruta global a pre-ruta
app.use('/cart', cartRoutes)

exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server HTTP running in PORT ${port}`);
}
