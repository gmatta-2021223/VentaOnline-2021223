'use strict'
// LOGICA

const Category = require('./category.model');
const Product = require('../product/product.model')

exports.defaultCategory = async()=>{
    try {
        let data = {
            name: 'Default',
            description: 'Default category'
        }

        let existCategory = await Category.findOne({name: 'Default'})
        if (existCategory) {

            return console.log('Default category already created')
            
        }

        let defCategory = new Category(data);
        await defCategory.save();
        return console.log('Default category created')


    } catch (err) {
        return console.error(err)
    }
}

exports.addCategory = async (req, res) => { //REQ = REQUEST | RES = RESPONS
    try {
        /*let data = {
            name: 'Home',
            description: 'Home Items'
        }*/ //Emular los datos que en algun momento le llegaran de una pagina web o una app

        let data = req.body;
        // Validar duplicados
        let existCategory = await Category.findOne({ name: data.name })
        if (existCategory) {
            return res.send({ message: 'Category already exist' })
        }

        let category = new Category(data);
        await category.save();
        return res.status(201).send({ message: 'Created category' });

    } catch (err) {

        console.error(err)
        return res.status(500).send({ message: 'Error saving category' })

    }

}

exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find();
        return res.send({ message: 'Categories found', categories })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting categories' })
    }
}

exports.getCategory = async (req, res) => {
    try {
        let categoryId = req.params.id;
        let category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return res.status(404).send({ message: 'Category not found' })
        }
        return res.send({ message: 'Category found', category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting category' })
    }
}

// update
exports.updateCategory = async (req, res) => {
    try {
        //obtener el id
        let categoryId = req.params.id;
        // obtener los datos del formulario (Body)
        let data = req.body;
        // buscar si existe (Para que no haya duplicados)
        let existCategory = await Category.findOne({ name: data.name }).lean()

        if (existCategory) {
            // validar que el id que le llega tenga el mismo nombre del que va a actualizar
            if (existCategory._id != categoryId) {
                return res.send({ message: 'Category already created' })
            }

            //actualizar la categoria
            let updatedCategory = await Category.findOneAndUpdate(
                { _id: categoryId },
                data,
                { new: true }
            )

            if (!updatedCategory) {

                return res.status(404).send({ message: 'Category not found and not updated' });

            }

            return res.send({ message: 'Category update', updatedCategory })

        }


        //actualizar la categoria
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: categoryId},
            data,
            {new: true}
        )

        if (!updatedCategory) {

            return res.status(404).send({message: 'Category not found and not updated'});
            
        }


        return res.send({ message: 'Category update', updatedCategory })

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating category' })
    }
}

//

exports.deleteCategory = async (req, res) => {
    try {
        let categoryId = req.params.id;

        let defaultCategory = await Category.findOne({name: 'Default'})
        // await Product.updateMany({category: categoryId}, {category: defaultCategory})
        /*
        let products = await Product.find({category: categoryId});
        
        for (let product of products) {
            
            product.category = defaultCategory._id
            await Product.findOneAndUpdate({category: categoryId}, product)  
            
        }
        */

        if (defaultCategory._id == categoryId) {
            return res.send({message: 'Default category can not be deleted'})
        }
        await Product.updateMany(
            {category: categoryId},
            {category: defaultCategory}
        )
        

        let deleteCategory = await Category.findOneAndDelete({ _id: categoryId })
        if (!deleteCategory) {

            return res.status(404).send({ message: 'Error deleting category' })

        }

        


        return res.send({ message: 'Categery deleted' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting category' })
    }
}