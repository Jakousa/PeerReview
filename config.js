require('dotenv').config()

module.exports.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports.DB_URL = process.env.DB_URL

module.exports.PORT = process.env.PORT || 3000
