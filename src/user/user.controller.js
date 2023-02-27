'use strict'

const User = require('./user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate')
const { createToken } = require('../services/jwt')

exports.defaultUser = async()=>{
    try {
        let data = {
            name: 'Gerson Aarón',
            surname: 'Matta Aguilar',
            username: 'gmatta',
            password: await encrypt('123'),
            email: 'gmatta-2021223@kinal.edu.gt',
            phone: '57841073',
            role: 'ADMIN'
        }

        let existUser = await User.findOne({username: 'gmatta'})
        if (existUser) {

            return console.log('Default user already created')
            
        }

        let defUser = new User(data);
        await defUser.save();
        return console.log('Default user created')


    } catch (err) {
        return console.error(err)
    }
}

// -------------------------------------------- CLIENTE --------------------------------------------

// Crear usuario desde Cliente

exports.register = async (req, res) => {
    try {
        // Capturar el formulario de registro
        let data = req.body;
        let params = {
            name: data.name,
            surname: data.surname,
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone,
            role: data.role
        }
        let validate = validateData(params);
        if (validate) {
            return res.status(400).send(validate)
        }
        // Rol predefinido
        data.role = 'CLIENT';
        // Encriptar contraseña
        data.password = await encrypt(data.password)
        // Guardar la información
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating account', error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        let data = req.body;
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials)
        if (msg) {
            return res.status(400).send(msg)
        }
        let user = await User.findOne({ username: data.username })
        if (user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user)
            return res.send({ message: 'User logged sucesfully', token })
        }
        return res.status(401).send({ message: 'Invalid Credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error, not logged' })
    }
}

// Actualizar sus datos desde el cliente

exports.updateUser = async (req, res) => {

    try {

        // Obtener ID
        let userId = req.params.id;

        //let userPassword = req.params.password;
        //console.log(userPassword)

        // Obtener datos (Del usuario logeado)
        let dataUser = req.user;

        //console.log(userId)
        //console.log(dataUser.sub)

        if (userId == dataUser.sub) {

            // Obtener datos que enviamos
            let dataBody = req.body;

            let dataSend = { // Se asignan los datos que estan en el body a una variable sin la contraseña
                name: dataBody.name,
                surname: dataBody.surname,
                username: dataBody.username,
                email: dataBody.email,

            }

            let msg = validateData(dataSend);
            if (msg) {
                return res.status(400).send(msg)
            }

            //Actualizamos los datos con datos ingresados en la variable dataSend
            let updatedUser = await User.findOneAndUpdate(

                { _id: userId },
                dataSend,
                { new: true }

            )

            return res.send({ message: 'User updated', updatedUser })

        } else {
            return res.status(401).send({ message: "You can't update other people's users" })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating user' })
    }

}

// Eliminar su propio usuario desde cliente

exports.deleteUser = async (req, res) => {

    try {

        // Obtener ID
        let userId = req.params.id;

        // Obtener datos (Del usuario logeado)
        let dataUser = req.user;

        if (userId == dataUser.sub) {

            let deleteUser = await User.findOneAndDelete({ _id: userId })

            if (!deleteUser) {
                return res.status(404).send({ message: 'Error deleting the user' })
            }

            return res.send({ message: 'User deleted' })

        } else {
            return res.status(401).send({ message: "You can't delete other people's users" })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting user' })
    }

}

// Cambiar su contraseña desde cliente

exports.updatePassword = async (req, res) => {
    try {

        let idUser = req.params.id;
        let userReq = req.user;
        let data = req.body;

        let dataSend = {
            oldPass: data.oldPass,
            newPass: data.newPass
        }

        let msg = validateData(dataSend);

        if (msg) {

            return res.status(400).send(msg)

        }

        if (idUser == userReq.sub) {

            let user = await User.findOne({ _id: userReq.sub })

            if (await checkPassword(dataSend.oldPass, user.password)) {
                dataSend.newPass = await encrypt(dataSend.newPass)
                let updateUser = await User.findByIdAndUpdate(

                    { _id: idUser },
                    { password: dataSend.newPass },
                    { new: true }

                )
                if (!updateUser) {
                    return res.status(401).send({ message: "Error updating password" })
                }
                return res.send({ message: "User password has been changed", updateUser })
            }
            return res.status(401).send({ message: "The passwords are not the same" })

        } else {
            return res.status(401).send({ message: "You can't update other people's passwords" })
        }


    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating password' })
    }
}

// -------------------------------------------- ADMINISTRADOR --------------------------------------------

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

// Crear un usuario sin importar su ROL
exports.save = async (req, res) => {
    try {
        // Capturar datos
        let data = req.body;
        let params = {
            name: data.name,
            surname: data.surname,
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone,
            role: data.role
        }
        let validate = validateData(params);
        if (validate) {
            return res.status(400).send(validate)
        }
        // Encriptar la password
        data.password = await encrypt(data.password);
        // Guardar
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving user', error: err.message })
    }
}

// Actualizar cualquier usuario CLIENTE
exports.updateUserAdmin = async (req, res) => {

    try {

        // Obtener ID ingresado en el URL
        let userId = req.params.id;

        // Obtener datos que enviamos
        let dataBody = req.body;

        let user = await User.findOne({ _id: userId })

        if (user.role == 'ADMIN') {
            return res.status(401).send({ message: "You can't update other admins users" })
        }

        let dataSend = { // Se asignan los datos que estan en el body a una variable sin la contraseña
            name: dataBody.name,
            surname: dataBody.surname,
            username: dataBody.username,
            email: dataBody.email,
            role: dataBody.role
        }

        let msg = validateData(dataSend);
        if (msg) {
            return res.status(400).send(msg)
        }

        //Actualizamos los datos con datos ingresados en la variable dataSend
        let updatedUser = await User.findOneAndUpdate(

            { _id: userId },
            dataSend,
            { new: true }

        )

        return res.send({ message: 'Client updated', updatedUser })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating client' })
    }

}

// Eliminar cualquier usuario CLIENTE
exports.deleteUserAdmin = async (req, res) => {

    try {

        // Obtener ID del URL
        let userId = req.params.id;

        let user = await User.findOne({ _id: userId })

        if (user.role == 'ADMIN') {
            return res.status(401).send({ message: "You can't delete other admins users" })
        }

        let deleteUser = await User.findOneAndDelete({ _id: userId })

        if (!deleteUser) {
            return res.status(404).send({ message: 'Error deleting the user' })
        }

        return res.send({ message: 'User deleted' })


    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting user' })
    }

}