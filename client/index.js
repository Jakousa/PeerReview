import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

const refresh = () => render(
    <App />,
    document.getElementById('app'),
)

refresh()

if (module.hot) {
    module.hot.accept()
}