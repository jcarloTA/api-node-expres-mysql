const Joi = require('joi')
const log = require('../../../utils/logger')

const plueprintUser = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(200).required(),
})


const userValid = (req, res, next) => {
    const result = Joi.validate(req.body, plueprintUser, {abortEarly: false, convert: false})
    if (result.error === null) {
        next()
    } else {
        // Bad request
        log.info("Usuario fallo la validacion", result.error.details.map( error => error.message))
        res.status(400).send("Informacion del usuario no cumple los requisitos. El nombre del usuario debe ser alfanumerico y tener 3 y 30 caractares. La contasenia debe tener entre 6 y 200 caracteres")
    }
}

const blueprintPedidoDeLogin = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
})

let loginValid = (req, res, next) => {
    const result = Joi.validate(req.body, blueprintPedidoDeLogin, {convert: false, abortEarly: false})

    if(result.error === null) {
        next()
    } else {
        res.status(400).send("Login fallo. Debes especificar el username y constrasenia del usuario. Ambos deben ser strings")
    }
}

module.exports = {
    userValid,
    loginValid
}