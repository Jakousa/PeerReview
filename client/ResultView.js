import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { List, Segment, Select, Dimmer, Loader, Button, Sidebar } from 'semantic-ui-react'

import { getGroups, createGroup, vote, selectGroup } from './util/reducers'
import GroupAdder from './GroupAdder'
import GroupGraph from './GroupGraph'
import SettingsSidebar from './SettingsSidebar'
import { listHeader, getVotingOptions } from './util/common'

class ResultView extends Component {

    state = {
        selectedGroup: undefined,
        settings: undefined
    }

    componentDidMount = () => {
        this.props.getGroups()
    }

    selectGroup = groupId => () => {
        this.props.selectGroup(groupId)
    }

    vote = groupId => (e, { value }) => {
        const oldVote = this.props.groups.find(group => group.id === groupId).votes.find(vote => vote.voter === this.props.user.id)
        const vote = { value }
        if (oldVote) {
            vote._id = oldVote._id
        }
        this.props.vote(groupId, vote)
    }

    getGroupValue = groupId => {
        const vote = this.props.groups.find(group => group.id === groupId).votes.find(vote => vote.voter === this.props.user.id)
        return vote ? vote.value : 0
    }

    clearEdit = () => this.setState({ selectedGroup: undefined })

    openEditGroup = () => this.setState({ selectedGroup: this.state.settings, settings: undefined })

    openSettings = groupId => () => this.setState({ settings: this.props.groups.find(group => group.id === groupId) })

    closeSettings = () => this.setState({ settings: undefined })

    groupList = () => (
        <List divided verticalAlign='middle'>
            {this.props.groups.map(group => {
                return (
                    <List.Item key={group.id}>
                        <List.Content floated='right'>
                            {this.props.user.username === 'Monitor' ?
                                <Button color="orange" onClick={this.selectGroup(group.id)}> Select </Button>
                                : null}
                            <Button inverted color="purple" onClick={this.openSettings(group.id)}> Edit </Button>
                            <Select
                                placeholder='Points'
                                onChange={this.vote(group.id)}
                                value={this.getGroupValue(group.id)}
                                options={getVotingOptions()}
                            />
                        </List.Content>
                        <List.Icon name='gamepad' size='large' verticalAlign='middle' />
                        <List.Content>
                            <List.Header as='a'>{listHeader(group)}</List.Header>
                            <List.Description>{group.members.join(' & ')}</List.Description>
                        </List.Content>
                    </List.Item>
                )
            })}
        </List>
    )

    render = () => {
        return (
            <Sidebar.Pushable as={Segment} >
                <SettingsSidebar editGroup={this.openEditGroup} group={this.state.settings} close={this.closeSettings} />
                <Sidebar.Pusher style={{ margin: '2%' }}>
                    <Dimmer active={!this.props.groups.length}>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    {this.groupList()}
                    <GroupAdder group={this.state.selectedGroup} clearSelect={this.clearEdit} />
                    {this.props.user.username === 'Monitor' ?
                        <Button color="orange" onClick={this.selectGroup(-1)}> Clear selected group </Button> : null
                    }
                    <Segment style={{ height: 400 }}>
                        <GroupGraph />
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

const mapStateToProps = ({ groups, user }) => ({
    groups: groups.sort((a, b) => listHeader(a).localeCompare(listHeader(b))),
    user
})

const mapDispatchToProps = dispatch => ({
    getGroups: () => dispatch(getGroups()),
    createGroup: group => dispatch(createGroup(group)),
    vote: (groupId, value) => dispatch(vote(groupId, value)),
    selectGroup: groupId => dispatch(selectGroup(groupId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultView)