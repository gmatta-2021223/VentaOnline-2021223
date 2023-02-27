'use strict'

//VALIDACIONES, ENCRIPTACIÓN, COMPARACIONES DE ENCRIPTACIÓN

const bcrypt = require('bcrypt');

// Validar que la informacion no venga vacia o con espacios en blanco
exports.validateData = (data) => {
    let keys = Object.keys(data);
    let msg = '';

    for (const key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== ''){ 
            continue
        }
        msg += `Params ${key} is required\n`

    }

    return msg.trim();

}

// Encriptar la contraseña
exports.encrypt = async(password)=>{
    try {
        //console.log(await bcrypt.hash(password,10))
        return await bcrypt.hash(password,10);
    } catch (err) {
        console.error(err);
        return err;
    }
}

// Verifica si la contraseña ingresada es igual a la encriptada
exports.checkPassword = async(password, hash)=>{
    try {
        //console.log(await bcrypt.compare(password, hash))
        return await bcrypt.compare(password, hash)
    } catch (err) {
        console.error(err)
        return false;
    }
}

