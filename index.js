const express = require('express')
const logger = require('./utils/logger')

const config = require('./config')

// libs npm
const bodyparser = require('body-parser')
const morgan = require('morgan')

//libs
const authJwt = require('./api/libs/auth')
//routes
const usersRoute = require('./api/resources/users/users.routes')
const gamesRoute = require('./api/resources/games/games.route')
//auth strategy
const passport = require('passport')
passport.use(authJwt)
// Intial
const app = express();
app.use(bodyparser.json())
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.use(passport.initialize())

app.use('/users', usersRoute)
app.use('/games', gamesRoute)

app.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    logger.info(JSON.stringify(req.user))
    res.send('Api already')
})

app.listen(config.host, () => {
    logger.info('Escuchando en el puerto' + config.host)
})

