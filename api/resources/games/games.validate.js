const Joi = require('joi')
const log = require('../../../utils/logger')

//hojas azules de arquitecto
const blueprintProducto = Joi.object().keys({
    name: Joi.string().max(150).required(),
    description: Joi.string().max(150).required(),
    progress: Joi.number().positive().precision(2).required(),
})

//moddeware -- funcion intermedia que va hacer algo antes del proceso
const validGame = (req, res, next) => {
    let resultado = Joi.validate(req.body,blueprintProducto, {abortEarly:false,convert:false})
    if (resultado.error === null) {
        next()
        return
    } else  {
        let erroresDeValidacion = resultado.error.details.reduce( (acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        log.warn('El siguiente juego no paso la validacion: ', req.body, erroresDeValidacion)
        res.status(400).send(`El juego en el body debe especificar nombre, descripcion, progreso. Errores en tu request: ${erroresDeValidacion}`)
    }
}

module.exports = {
    validGame,
}