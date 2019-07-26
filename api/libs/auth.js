const log = require('./../../utils/logger')

const passportJWT = require('passport-jwt')
const config = require('../../config')
const userController = require('../resources/users/users.controller')
//Token debe ser espificado mediante el header "Authorizacion" . Ejemplo
// Authorization: bearer xxxx.yyyy.xxxx

let jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, async (jwtPayload, next) => {

    try {
        const res = await userController.getUser({id: jwtPayload.id })
        const user = res[0]
        if(!user) {
            log.info(`JWT token no es valido. Usuario con id ${jwtPayload.id} no existe.`)
            next(null, false)
            return
        }
        log.info(`Usuario ${user.username} suministro un token valido. Autenticacion completada.`)
        next(null, {
            username: user.username,
            id: user.id
        })
    } catch (err) {
        console.log('usuario no valido')
        log.error("Error ocurrio al tratar de validar un token", err)
        next(err)
    }    
})
