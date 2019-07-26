const express = require('express')
const passport = require('passport')
const log = require('../../../utils/logger')

const { validGame } = require('./games.validate')

const gamesRoute = express.Router();
const jwtAuthenticate = passport.authenticate('jwt',{session:false});

const gamesController = require('./games.controller')

gamesRoute.get('/', jwtAuthenticate, async (req, res) => {
    try {
        const games = await gamesController.getGamesByUserId(req.user.id)
        res.status(200).send({games: games})
        return
    } catch (err) {
        log.error(err)
        res.status(500).send("Error al leer los juegos a la base de datos.")
        return
    }
})

gamesRoute.post('/', [validGame, jwtAuthenticate], async (req, res) => {
    try {
        const result = await gamesController.createGame(req.body, req.user.id)
        const game = await gamesController.getGameById(result.insertId)
        if(!result.insertId) {
            throw new Error("No se pudo crear el usuario en la BD")
        }
        res.status(201).json(game[0])
    } catch (err) {
        log.error("juego no pudo ser creado", err)
        res.status(500).send("Error ocurrio al tratar de crear el juegos")
    }
})

gamesRoute.get('/:id', jwtAuthenticate, async(req, res) => {
    let game_id = req.params.id;
    try {
        const result = await gamesController.getGameById(game_id)
        if (result.length == 0) {
            res.status(404).send(`Producto con id [${game_id}] no existe.`)
            return 
       } else {
            res.json({game: result[0]})
            return
       }

    } catch (err) {
        log.error(`Excepcion ocurrio al tratar de obtener un juego con id [${game_id}]`,err);
        res.status(500).send(`Error ocurrio obteniendo juego con id [${game_id}]`)
    }
})

gamesRoute.put('/:id', [jwtAuthenticate, validGame], async (req, res) => {
    let game_id =  parseInt(req.params.id),
        user_id = req.user.id,
        game_search,
        game_edit;
    try {
        game_search = await gamesController.getGameById(game_id);
    } catch (err) {
        log.warn(`Excepcion ocurrio al procesar la modificacion del juego con id [${game_id}]`, err)
        res.status(500).send(`Error ocurrion modificando juego con id [${game_id}]`)
        return
    }

    if (game_search.length == 0) {
        res.status(404).send(`El juego con id [${game_id}] no existe`)
        return 
    }
    game_edit = game_search[0]
    if(game_edit.user_id !== user_id) {
        log.warn(`Usuario [${user_id}] no es dueno del juego con id [${game_id}]. Dueno real es [${game_edit.user_id}]. Request no sera procesado`)
        res.status(401).send(`No eres dueno del juego con id [${game_id}]. Solo puedes modificar productos creados por ti`)
        return;
    }

    try {
        const update = await gamesController.editGame(req.body,game_id)
        if(update.affectedRows == 0) {
            throw new Error("Error al actualizar juego")
        }
        res.status(200).send('Juego actualizado con exito')
        return
    } catch (err) {
        log.error(`Excepcion al tratar de remplazar juego con id [${game_id}] `, err);
        res.status(500).send(`Error ocurrio remplazando juego con id [${game_id}]`)
    }
})

gamesRoute.delete('/:id', jwtAuthenticate, async (req, res) => {
    let game_id = req.params.id,
        user_id = req.user.id,
        delete_game,
        search_game;
    try {
        search_game = await gamesController.getGameById(game_id)
    } catch (err) {
        log.error(`Exepcion ocurrio al procesar el borrado de juego con id [${game_id}]`, err)
        res.status(500).send(`Error ocurrio borrando juego con id [${game_id}]`)
        return
    }

    if (search_game.length == 0) {
        res.status(404).send(`El juego con id [${game_id}] no existe`)
        return 
    }
    delete_game = search_game[0]
    if(delete_game.user_id !== user_id) {
        log.info(`Usuario ${user_id} no es dueno de producto con id [${game_id}], Dueno real es [${delete_game.user_id}]. Request no sera procesado`)
        res.status(401).send(`No eres dueno del producto con id [${game_id}]. Solo puedes borrar productos creados por ti`);
        return
    }

    try {
        const result = await gamesController.deleteGame(game_id)
        console.log('result d', result)
        if(update.affectedRows == 0) {
            throw new Error("Error al borrar juego")
        }
        log.info(`Producto con id [${game_id}] fue borrado`)
        res.status(200).send('Juego borrado con exito')
    } catch (err) {
        log.info(`Error ocurrio borrando juego con id [${game_id}] `, err)
        res.status(500).send(`Error ocurrio borrando juego con id [${game_id}]`)
    }

})



module.exports = gamesRoute