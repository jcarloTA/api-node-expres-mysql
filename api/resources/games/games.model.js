const pool = require('../../libs/database')

function create(game) {
    return pool.query('INSERT INTO games SET ? ', game)
}

function getAll() {
    return pool.query('SELECT id, name, description, user_id, progress FROM games')
}

function getAllByUserId(id) {
    return pool.query('SELECT id, name, description, user_id, progress FROM games WHERE user_id = ?', id)
}

function findId(id) {
    return pool.query('SELECT id, name, description, user_id, progress FROM games WHERE id = ?', id)
}

function update(game, game_id) {
    return pool.query('UPDATE games SET ?  WHERE id = ?', [game, game_id])
}

function deleteg(game_id) {
    return pool.query('DELETE FROM games WHERE id = ? ', game_id)
}

module.exports = {
    create,
    getAll,
    getAllByUserId,
    findId,
    update,
    deleteg
}