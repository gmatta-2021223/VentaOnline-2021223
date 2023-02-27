'use strict'

const Product = require('./product.model')
const Category = require('../category/category.model')
// -------------------------------------------- CLIENTE --------------------------------------------

exports.searchProducts = async (req, res)=>{
    try {
        let data = req.body;
        let query = { name: { $regex: new RegExp(data.name, "i") } }

        let findProducts = await Product.find(query).select('-stock -_id').populate('category', ['name', 'description'])

        return res.send({message: 'Matches Found', findProducts})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}

exports.searchCategories = async (req, res)=>{
    try {
        let data = req.body;
        let findCategory = await Category.findOne({ name: { $regex: new RegExp(data.name, "i") } });
        //console.log(findCategory)
        if (!findCategory) {
            return res.send({message: 'That category dont exist'})
        }
        let query = { category: findCategory._id }

        let findProducts = await Product.find(query).select('-stock -sales').populate('category', ['name', 'description'])

        return res.send({message: 'Matches Found', findProducts})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}


// -------------------------------------------- ADMINISTRADOR --------------------------------------------

exports.test = (req, res) => {
    res.send({ message: 'Hola' })
}

exports.addProduct = async (req, res) => {
    try {
        // Obtener la información a agregar
        let data = req.body;
        // Si existe la categoria -> Guarde
        let existsCategory = await Category.findOne({ _id: data.category })
        if (existsCategory) {

            // Guardar
            let product = new Product(data);
            await product.save();
            return res.send({ message: 'Product saved sucessfully' })

        }
        // No existe la categoria -> Mensaje de que no existe la categoria

        if (!existsCategory) {
            return res.status(404).send({ message: 'Category dont exists' })
            //return res.send({ message: 'Category dont exists' })
        }
        


    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating product' })
    }
}

exports.getProducts = async(req, res)=>{
    try {
        // Buscar datos
        let products = await Product.find().populate('category');
        return res.send({message: 'Products found,', products})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting products'})
    }
}

exports.getProduct = async(req, res)=>{
    try {
        // Obtener el ID del producto a buscar
        let productId = req.params.id;
        // Buscarlo en BD
        let product = await Product.findOne({_id: productId}).populate('category');
        //Valido que exista el producto
        if (!product) {
            return res.status(404).send({message: 'Product not found'})
        }
        //Si existe lo devuelvo
        return res.send({message: 'Product found', product})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting product'})
    }
}

exports.deleteProduct = async(req,res)=>{
    try {
        let productId = req.params.id;
        let deleteProduct = await Product.findOneAndDelete({_id: productId})
        if (!deleteProduct) {
            return res.status(404).send({message: 'Error deleting the product'})
        }
        return res.send({message: 'This product has been deleted:',deleteProduct})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

exports.updateProduct = async(req,res)=>{
    try {
        // Obtener ID
        let productId = req.params.id;
        // Obtener datos (Body)
        let data = req.body;
        // Buscar si existe la categoria
        let existCategory = await Category.findOne({_id: data.category})
        if (!existCategory) {
            return res.status(404).send({message: 'Category found'})
        }
        //Actualizar
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: productId},
            data,
            {new: true}
        )
        if (!updatedProduct) {
            return res.send({message: 'Product not found and not updated'})
        }

        return res.send({message: 'Product updated', updatedProduct})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating product'})
    }
}