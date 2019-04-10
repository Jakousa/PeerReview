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
  const route = `/groups/${groupId}/vote`
  const prefix = 'VOTE_'
  return callController(route, prefix, vote, 'post')
}

export const getSelected = () => {
  const route = `/groups/selected`
  const prefix = 'GET_SELECTED_'
  return callController(route, prefix)
}

export const selectGroup = groupId => {
  const route = `/groups/${groupId}`
  const prefix = 'SELECT_GROUP_'
  return callController(route, prefix)
}

export const sendFeedback = (groupId, feedback) => {
  const route = `/groups/${groupId}/feedback`
  const prefix = 'SEND_FEEDBACK_'
  return callController(route, prefix, { text: feedback }, 'post')
}

const groups = (state = { data: [], loading: false }, action) => {
  switch (action.type) {
    case 'GET_GROUPS_ATTEMPT':
      return {
        ...state,
        loading: true,
      }
    case 'GET_GROUPS_FAILURE':
      return {
        ...state,
        loading: false,
      }
    case 'GET_GROUPS_SUCCESS':
      return {
        data: action.response,
        loading: false
      }
    case 'CREATE_GROUP_SUCCESS':
      return {
        ...state,
        data: [...state.data.filter(group => group.id !== action.response.id), action.response]
      }
    case 'VOTE_SUCCESS':
      const groupId = action.response.groupId
      const vote = action.response.vote
      const group = { ...state.find(group => group.id === groupId) }
      group.votes = [...group.votes.filter(v => v._id !== vote._id), vote]
      return {
        ...state,
        data: [...state.data.filter(g => g.id !== group.id), group]
      }
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

const selectedGroup = (state = {}, action) => {
  switch (action.type) {
    case 'GET_SELECTED_SUCCESS':
      return action.response
    default:
      return state
  }
}

export default combineReducers({
  groups,
  user,
  selectedGroup
})