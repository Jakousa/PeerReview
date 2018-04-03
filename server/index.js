import express from 'express'
import webpack from 'webpack'
import middleware from 'webpack-dev-middleware'
import hotMiddleWare from 'webpack-hot-middleware'
import './mongo'
import { getGroups, addGroup } from './mongo/controllers'
import { json } from 'body-parser'

const PORT = 3000;
const compiler = webpack({
    mode: process.env.NODE_ENV,
    entry: './client/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    entry: ['./client/index',
        'webpack-hot-middleware/client']
})
const app = express();

app.use(middleware(compiler))
app.use(hotMiddleWare(compiler))

app.get('/', (req, res) => {
    const html = `<!DOCTYPE html><html><head><title>Peer review</title><link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link></head><body><div id="app"></div><script src="/main.js"></script></body></html>`
    res.send(html)
})

app.get('/api/groups', getGroups)

app.post('/api/groups', json(), addGroup)

app.listen(PORT, () => { console.log(`Started on port ${PORT}`) })
