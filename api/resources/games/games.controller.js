
const gamesModel = require('./games.model')


function createGame(game, user_id) {
    return gamesModel.create({...game, user_id})
}

function getGameById(id) {
    return gamesModel.findId(id)
}

function getGames() {
    return gamesModel.getAll();
}

function editGame(game, game_id) {
    return gamesModel.update(game, game_id)
}

function getGamesByUserId(user_id) {
    return gamesModel.getAllByUserId(user_id)
}

function deleteGame(game_id) {
    return gamesModel.deleteg(game_id)
}

module.exports = {
    createGame,
    editGame,
    getGamesByUserId,
    getGames,
    getGameById,
    deleteGame
}