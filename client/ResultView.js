import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { getGroups, createGroup, vote } from './util/reducers'

import GroupAdder from './GroupAdder'
import GroupGraph from './GroupGraph'
import { List, Segment, Select, Dimmer, Loader } from 'semantic-ui-react'

class ResultView extends Component {

    state = {
        groups: [],
        selectedGroup: undefined,
        openOptions: { id: undefined, value: 0 }
    }

    componentDidMount = () => {
        this.props.getGroups()
    }

    handleAddGroup = group => {
        this.props.createGroup(group)
    }

    vote = groupId => (e, { value }) => {
        const oldVote = this.props.groups.find(group => group.id === groupId).votes.find(vote => vote.voter === this.props.user.id)
        console.log(oldVote, 'Wanha')
        const vote = { value }
        if (oldVote) {
            vote._id = oldVote._id
        }
        this.props.vote(groupId, vote)
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

    getGroupValue = groupId => {
        const vote = this.props.groups.find(group => group.id === groupId).votes.find(vote => vote.voter === this.props.user.id)
        return vote ? vote.value : 0
    }

    clearSelect = () => this.setState({ selectedGroup: undefined })

    selectGroup = groupId => () => {
        const { id, value } = this.state.openOptions
        if (id === groupId) {
            if (value > 3) {
                this.setState({ selectedGroup: this.props.groups.find(group => group.id === groupId) })
            } else {
                this.setState({ openOptions: { id, value: value + 1 } })
            }
        } else {
            this.setState({ openOptions: { id: groupId, value: 1 } })
        }
    }

    groupList = () => (
        <List divided verticalAlign='middle'>
            {this.props.groups.map(group => {
                return (
                    <List.Item key={group.id}>
                        <List.Content floated='right'>
                            <Select
                                placeholder='Points'
                                onChange={this.vote(group.id)}
                                value={this.getGroupValue(group.id)}
                                options={[{ key: 1, value: 1, text: 1 }, { key: 0, value: 0, text: 0 }]}
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
        return (
            <Segment>
                <Dimmer active={!this.props.groups.length}>
                    <Loader>Loading</Loader>
                </Dimmer>
                {this.groupList()}
                <GroupAdder addGroup={this.handleAddGroup} group={this.state.selectedGroup} clearSelect={this.clearSelect} />
                <Segment style={{ height: 400 }}>
                    <GroupGraph groups={this.props.groups} />
                </Segment>
            </Segment>
        )
    }
}

const mapStateToProps = ({ groups, user }) => ({
    groups,
    user
})

const mapDispatchToProps = dispatch => ({
    getGroups: () => dispatch(getGroups()),
    createGroup: group => dispatch(createGroup(group)),
    vote: (groupId, value) => dispatch(vote(groupId, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultView)