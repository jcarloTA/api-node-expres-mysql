const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const log = require('../../../utils/logger')

const { loginValid, userValid } = require('./users.validate')

const config = require('../../../config')
const userController = require('./users.controller');


usersRoute = express.Router();

function transformarBodyALowerCase(req,res,next) {
    req.body.username && (req.body.username = req.body.username.toLowerCase());
    next();
}


usersRoute.get('/', async (req, res) => {
    try {
        const users = await userController.getUsers();
        res.json({users:users})
    } catch (err) {
        log.error(err)
        req.sendStatus(500).send('Error al obtener todos los usuarios')
    }
})

usersRoute.post('/', [userValid, transformarBodyALowerCase], async (req, res) => {
    let newUser = req.body

    try {
        const userExist = await userController.userExist(newUser.username)
        if (userExist) {
            log.warn(`username [${newUser.username}] ya existe en la base de datos`)
            res.status(409).send('El usuario ya exite')
            return
        }
        const hashedPassword = bcrypt.hashSync(newUser.password, 10)
        const userCreated = await userController.userCreate(newUser, hashedPassword)
        if(!userCreated.insertId) {
           throw new Error("No se pudo crear el usuario en la BD")
        }
        res.status(201).send('Usuario creado exitosamente')
    } catch (err) {
        log.error(err)
        log.error(`Error ocurrio al tratar de verificar si usuario [${newUser.username}] ya existe`)
        res.status(500).send('Error ocurrio al tratar de crear nuevo usuario.')
    }
})

usersRoute.post('/login', [loginValid, transformarBodyALowerCase], async (req, res) => {
    let unauthenticatedUser = req.body,
        registeredUser;
    try {
        let res = await userController.getUser({
            username: unauthenticatedUser.username
        })
        registeredUser = res[0]
    } catch (err) {
        log.error(`Error ocurrio al tratar de determinar si el usuario [${unauthenticatedUser.username}] ya existe`, err)
        res.status(500).send('Error ocurrio durante el proceso de login.')
        return
    }

    console.log('registreUser', registeredUser)
    if (!registeredUser) {
        log.info(`Usuario [${unauthenticatedUser.username}] no existe. No pudo ser autenticado`)
        res.status(400).send(`Credenciales incorrectas. Asegurate que el username y contrasenioa sean correctas`)
        return
    }

    let correctPassword 
    try {
        correctPassword = await bcrypt.compare(unauthenticatedUser.password,registeredUser.password)
        if (correctPassword) {
            //Generar y enviar token
            let token = jwt.sign({id: registeredUser.id}, config.jwt.secret, { expiresIn: config.jwt.expiryTime })
            log.info(`Usuario ${unauthenticatedUser.username} completo autenticacion exitosamante`)
            res.status(200).json({ token })
        } else {
            log.info(`Usuario ${unauthenticatedUser.username} no completo autenticacion, contrasenia incorrecta`)
            res.status(400).send('Credenciales incorrectas. Asegurate que el username y contraseña sean correctas.')
        }
    } catch (err) {
        log.error(`Error ocurrio al tratar de verificar si la contrasenia es correcta`, err);
        res.status(500).send('Error ocurrio durante el proceso de login')
        return
    }
})

module.exports = usersRoute