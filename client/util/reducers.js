import { callController } from './apiConnection'
import { combineReducers } from 'redux'

export const getGroups = () => {
    const route = '/groups'
    const prefix = 'GET_GROUPS_'
    return callController(route, prefix)
}

export const createGroup = group => {
    const route = '/groups'
    const prefix = 'CREATE_GROUP_'
    return callController(route, prefix, group, 'post')
}

export const vote = (groupId, vote) => {
    const route = `/groups/${groupId}`
    const prefix = 'VOTE_'
    return callController(route, prefix, vote, 'post')
}


const groups = (state = [], action) => {
    switch (action.type) {
        case 'GET_GROUPS_SUCCESS':
            return action.response
        case 'CREATE_GROUP_SUCCESS':
            return [...state.filter(group => group.id !== action.response.id), action.response]
        case 'VOTE_SUCCESS':
            const groupId = action.response.groupId
            const vote = action.response.vote
            const group = { ...state.find(group => group.id === groupId) }
            group.votes = [...group.votes.filter(v => v._id !== vote._id), vote]
            return [...state.filter(g => g.id !== group.id), group]
        default:
            return state
    }
}

const user = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return action.user
        default:
            return state
    }
}

export default combineReducers({
    groups,
    user
})