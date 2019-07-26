const environment = process.env.NODE_ENV || 'develoment'

const baseConfiguration = {
    jwt: {},
    host: 3000,
    database: {}
}

let environmentSettings= {}

switch (environment) {
    case 'dev':
    case 'develoment':
        environmentSettings = require('./dev')
        break
    case 'poroduction':
    case 'prod':
        environmentSettings = require('./prod')
        break
    default:
        environmentSettings = require('./dev')
}

module.exports = {
    ...baseConfiguration,
    ...environmentSettings
}