import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection

db.once('open', () => console.log('Connection established'))

process.on('SIGINT', () => mongoose.connection.close(() => {
    console.log('Connection cut')
    process.exit(0)
}))
