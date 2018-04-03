import React, { Component } from 'react'
import axios from 'axios'

import GroupAdder from './GroupAdder'
import GroupGraph from './GroupGraph'
import { List, Segment, Select } from 'semantic-ui-react'
import io from 'socket.io-client'

const VOTE_ITEM = 'votes'
const MAX_POINTS = 10

export default class VotingView extends Component {

    state = {
        groups: [],
        votes: []
    }

    componentDidMount = async () => {
        const { data: groups } = await axios.get('/api/groups')
        const votes = JSON.parse(localStorage.getItem(VOTE_ITEM)) || []
        this.setState({ groups, votes })
        const socket = io(window.location.origin)
        socket.on("VOTE", groups => this.setState({ groups }))
    }

    handleAddGroup = async (group) => {
        const { data: newGroup } = await axios.post('/api/groups', group)
        this.setState({ groups: [...this.state.groups, newGroup] })
    }

    vote = groupId => async (e, { value }) => {
        const oldVote = this.state.votes.find(vote => vote.groupId === groupId)
        let id
        if (oldVote) {
            const { data: updatedVote } = await axios.post(`/api/groups/${groupId}`, { id: oldVote.id, value })
            id = updatedVote.id
        } else {
            const { data: voteWithId } = await axios.post(`/api/groups/${groupId}`, { value })
            id = voteWithId.id
        }
        const votes = [...this.state.votes.filter(vote => vote.groupId !== groupId), { groupId, value, id }]
        this.setState({ votes }, localStorage.setItem(VOTE_ITEM, JSON.stringify(votes)))
    }

    listHeader = (group) => {
        let header = ''
        if (group.projectTitle) {
            header += group.projectTitle
        }
        if (group.projectTitle && group.groupName) {
            header += ', by '
        }
        if (group.groupName) {
            header += group.groupName
        }
        return header
    }

    remainingPoints = () => this.state.votes.reduce((prev, cur) => prev - cur.value, MAX_POINTS)

    getGroupValue = groupId => {
        const vote = this.state.votes.find(vote => vote.groupId === groupId)
        return vote ? vote.value : 0
    }

    getOptions = groupId => {
        let max = 3
        const pointOptions = []
        if (this.getGroupValue(groupId)) {
            max = this.getGroupValue(groupId) + this.remainingPoints()
        } else {
            max = this.remainingPoints()
        }
        max = Math.min(3, max)
        for (let index = 0; index <= max; index++) {
            pointOptions.push({ key: index, value: index, text: index })
        }
        return pointOptions
    }

    groupList = () => {

        return (
            <List divided verticalAlign='middle'>
                {this.state.groups.map(group => {
                    return (
                        <List.Item key={group.id}>
                            <List.Content floated='right'>
                                <Select
                                    placeholder='Points'
                                    onChange={this.vote(group.id)}
                                    value={this.getGroupValue(group.id)}
                                    options={this.getOptions(group.id)}
                                />
                            </List.Content>
                            <List.Icon name='gamepad' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header as='a'>{this.listHeader(group)}</List.Header>
                                <List.Description as='a'>{group.members.join(' & ')}</List.Description>
                            </List.Content>
                        </List.Item>
                    )
                })}
            </List>
        )
    }

    render = () => {
        console.log(this.state.groups)
        const points = this.remainingPoints();
        return (
            <Segment>
                Review the groups, you have {points} point{points !== 1 ? 's' : ''} left to give:
                {this.groupList()}
                <GroupAdder addGroup={this.handleAddGroup} />
                <Segment>
                    <GroupGraph groups={this.state.groups} />
                </Segment>
            </Segment>
        )
    }
}