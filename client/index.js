import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import App from './App'
import reducers from './util/reducers'
import { handleRequest, socketToStore } from './util/apiConnection'

const composeEnhancers = (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk, handleRequest)))

socketToStore(store)

const refresh = () => render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'),
)

refresh()

if (module.hot) {
    module.hot.accept()
}