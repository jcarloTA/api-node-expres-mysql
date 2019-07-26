const pool = require('../../libs/database')

function create(user) {
    return pool.query('INSERT INTO users SET ?', user)
}

function getAll() {
    return pool.query('SELECT id, username FROM users')
}

function find(username, id) {
   return pool.query('SELECT id, username, password FROM users WHERE username = ? OR id = ?', [username,id])  
}

function findByID(id) {
    return pool.query('SELECT id, username, password FROM users WHERE id = ?', id) 
}

function findByUsername(username) {
    return pool.query('SELECT id, username, password FROM users WHERE username = ?', username) 
}

module.exports = {
    getAll,
    find,
    create,
    findByID,
    findByUsername
}
