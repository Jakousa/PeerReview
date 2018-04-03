import express from 'express'
import socketIo from 'socket.io'
import http from 'http'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleWare from 'webpack-hot-middleware'
import { json } from 'body-parser'
import './mongo'
import { getGroups, addGroup, handleVote } from './mongo/controllers'
import { PORT, NODE_ENV } from '../config'
import webpackConf from '../webpack.config'
const app = express();
const server = http.createServer(app)
const io = socketIo(server)

if (NODE_ENV === 'development') {
    const compiler = webpack(webpackConf)
    app.use(middleware(compiler))
    app.use(hotMiddleWare(compiler))
} else {
    app.use('/', express.static('dist/'))
}

app.get('/', (req, res) => {
    const html = `<!DOCTYPE html><html><head><title>Peer review</title><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link></head><body><div id="app"></div><script src="/main.js"></script></body></html>`
    res.send(html)
})

app.get('/api/groups', getGroups)

app.post('/api/groups', json(), addGroup)

app.post('/api/groups/:groupId', json(), handleVote(io))

io.on("connection", socket => {
    console.log('Client connected')
    socket.on("disconnect", () => console.log("Client disconnected"));
})

server.listen(
    //app.listen(
    PORT, () => { console.log(`Started on port ${PORT}`) })
