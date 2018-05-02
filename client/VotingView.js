import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Container, Grid, Segment, Select, Icon, Form, Button } from 'semantic-ui-react'

import { getSelected, getGroups, vote, sendFeedback } from './util/reducers'
import { listHeader, getVotingOptions } from './util/common'

const INITIAL_STATE = {
    feedback: '',
    sent: false
}

class VotingView extends Component {
    state = INITIAL_STATE

    componentDidMount() {
        this.props.getGroups()
        this.props.getSelected()
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.group && nextProps.group.id !== this.props.group.id) {
            this.setState(INITIAL_STATE)
        }
    }

    handleChange = (e, { value }) => this.setState({ feedback: value })

    getOldVote = () => this.props.group.votes.find(vote => vote.voter === this.props.user.id)

    vote = (e, { value }) => {
        const { group } = this.props
        const oldVote = this.getOldVote()
        const vote = { value }
        if (oldVote) {
            vote._id = oldVote._id
        }
        this.props.vote(group.id, vote)
    }

    getGroupValue = () => {
        const vote = this.props.group.votes.find(vote => vote.voter === this.props.user.id) || 0
        return vote ? vote.value : 0
    }

    sendFeedback = () => {
        if (this.state.feedback && !this.state.sent) {
            this.props.sendFeedback(this.props.group.id, this.state.feedback)
            this.setState({ sent: true })
        }
    }

    render() {
        const { group } = this.props
        if (!group) {
            return (
                <div>
                    No group selected
                </div>
            )
        }
        const previousFeedback = group.feedback.find(feedback => feedback.voter === this.props.user.id)
        return (
            <Container>
                <Segment>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column>
                                <h3>{listHeader(group)}</h3>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                Vote: <Select
                                    placeholder='Points'
                                    onChange={this.vote}
                                    value={this.getGroupValue()}
                                    options={getVotingOptions()}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                Voted: {this.getOldVote() ? <Icon name='check' color='green' /> : <Icon name='close' color='red' />}
                                | Votes received: {group.votes.length}

                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <b> Feedback </b>
                                <Form>
                                    <Form.TextArea value={this.state.feedback} onChange={this.handleChange} />
                                    <Button color="orange" type="submit" disabled={this.state.sent} onClick={this.sendFeedback}>Submit feedback</Button>
                                </Form>
                                Feedback given: {previousFeedback ? <Icon name='check' color='green' /> : <Icon name='close' color='red' />}
                                {previousFeedback ? 'Thank you for your feedback' : null}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment >
            </Container >
        )
    }
}

const mapStateToProps = ({ groups, selectedGroup, user }) => ({
    group: groups.find(group => group.id === selectedGroup.id),
    user
})

const mapDispatchToProps = dispatch => ({
    getSelected: () => dispatch(getSelected()),
    getGroups: () => dispatch(getGroups()),
    vote: (groupId, value) => dispatch(vote(groupId, value)),
    sendFeedback: (groupId, string) => dispatch(sendFeedback(groupId, string))
})

export default connect(mapStateToProps, mapDispatchToProps)(VotingView)