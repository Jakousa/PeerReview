import axios from 'axios'
import io from 'socket.io-client'

const getAxios = () => axios.create({ baseURL: '/api' })

const callApi = async (url, method = 'get', data, user) => {
    const options = {}
    options.headers = { User: user.id }
    switch (method) {
        case 'get':
            return getAxios().get(url, options)
        case 'post':
            return getAxios().post(url, data, options)
        case 'put':
            return getAxios().put(url, data, options)
        case 'delete':
            return getAxios().delete(url, options)
        default:
            return Promise.reject(new Error('Invalid http method'))
    }
}

export const callController = (route, prefix, data, method = 'get', query) => {
    const requestSettings = {
        route,
        method,
        data,
        prefix,
        query
    }
    return { type: `${prefix}ATTEMPT`, requestSettings }
}

export const handleRequest = store => next => async (action) => {
    next(action)
    const { requestSettings } = action
    if (requestSettings) {
        const {
            route, method, data, prefix, query
        } = requestSettings
        try {
            const res = await callApi(route, method, data, store.getState().user)
            store.dispatch({ type: `${prefix}SUCCESS`, response: res.data, query })
        } catch (err) {
            console.log('Vika:', err)
            store.dispatch({ type: `${prefix}FAILURE`, response: err, query })
        }
    }
}

let socket

export const socketToStore = store => {
    socket = io(window.location.origin)
    socket.connect()
    socket.on("VOTE", groups => {
        store.dispatch({ type: 'LOL WTF', response: groups })
    })
}
export const disconnectSocket = () => {
    this.socket.disconnect()
}