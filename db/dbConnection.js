const knex = require('knex')
const dbConfig = require('../knexfile.js')

const dbConnection = knex(dbConfig)

module.exports = dbConnection