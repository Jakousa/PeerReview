import React, { Component } from 'react'
import axios from 'axios'

import GroupAdder from './GroupAdder'
import GroupGraph from './GroupGraph'
import { List, Segment, Select, Dimmer, Loader } from 'semantic-ui-react'
import io from 'socket.io-client'

const MAX_POINTS = 10

export default class VotingView extends Component {

    state = {
        groups: [],
        selectedGroup: undefined,
        openOptions: { id: undefined, value: 0 }
    }

    socket = undefined

    componentDidMount = async () => {
        const { data: groups } = await axios.get('/api/groups')
        this.setState({ groups })
        this.socket = io(window.location.origin)
        this.socket.connect()
        this.socket.on("VOTE", groups => this.setState({ groups }))
    }

    componentWillUnmount() {
        this.socket.disconnect()
    }

    handleAddGroup = async (group) => {
        const { data: newGroup } = await axios.post('/api/groups', group)
        this.setState({ groups: [...this.state.groups.filter(group => group.id !== newGroup.id), newGroup], selectedGroup: undefined })
    }

    vote = groupId => async (e, { value }) => {
        const oldVote = this.props.votes.find(vote => vote.groupId === groupId)
        let id
        if (oldVote) {
            const { data: updatedVote } = await axios.post(`/api/groups/${groupId}`, { id: oldVote.id, value })
            id = updatedVote.id
        } else {
            const { data: voteWithId } = await axios.post(`/api/groups/${groupId}`, { value })
            id = voteWithId.id
        }
        const votes = [...this.props.votes.filter(vote => vote.groupId !== groupId), { groupId, value, id }]
        this.props.changeVote(votes)
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

    remainingPoints = () => this.props.votes.reduce((prev, cur) => prev - cur.value, MAX_POINTS)

    getGroupValue = groupId => {
        const vote = this.props.votes.find(vote => vote.groupId === groupId)
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

    clearSelect = () => this.setState({ selectedGroup: undefined })

    selectGroup = groupId => () => {
        const { id, value } = this.state.openOptions
        if (id === groupId) {
            if (value > 3) {
                this.setState({ selectedGroup: this.state.groups.find(group => group.id === groupId) })
            } else {
                this.setState({ openOptions: { id, value: value + 1 } })
            }
        } else {
            this.setState({ openOptions: { id: groupId, value: 1 } })
        }
    }

    groupList = () => (
        <List divided verticalAlign='middle'>
            {this.state.groups.sort((a, b) => this.listHeader(a).localeCompare(this.listHeader(b))).map(group => {
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
                            <List.Header as='a' onClick={this.selectGroup(group.id)}>{this.listHeader(group)}</List.Header>
                            <List.Description>{group.members.join(' & ')}</List.Description>
                        </List.Content>
                    </List.Item>
                )
            })}
        </List>
    )

    render = () => {
        const points = this.remainingPoints();
        return (
            <Segment>
                <Dimmer active={!this.state.groups.length}>
                    <Loader>Loading</Loader>
                </Dimmer>
                Review the teams, you have {points} point{points !== 1 ? 's' : ''} left to give:
                {this.groupList()}
                <GroupAdder addGroup={this.handleAddGroup} group={this.state.selectedGroup} clearSelect={this.clearSelect} />
                <Segment style={{ height: 400 }}>
                    <GroupGraph groups={this.state.groups} />
                </Segment>
            </Segment>
        )
    }
}