import React, { Component } from 'react'
import { Container, Form, Button, Segment } from 'semantic-ui-react'
import VotingView from './VotingView'

const LOGIN_ITEM = 'users'
const VOTE_ITEM = 'votes'

const INITIAL_STATE = {
    possibleUsers: [],
    user: { username: '', votes: [] },
    loggedIn: false
}

export default class App extends Component {
    state = INITIAL_STATE

    componentDidMount() {
        const possibleUsers = JSON.parse(localStorage.getItem(LOGIN_ITEM)) || []
        if (possibleUsers) {
            this.setState({ possibleUsers })
        }
    }

    handleChange = (e, { value: username }) => this.setState({ user: { ...this.state.user, username } })

    handleRegister = () => {
        const { user } = this.state
        if (user.username) {
            this.setState({ loggedIn: true, user })
            localStorage.setItem(LOGIN_ITEM, JSON.stringify([...this.state.possibleUsers, user.username]))
        }
    }

    handleLogin = uname => () => {
        const username = this.state.possibleUsers.find(username => uname === username)
        if (username) {
            const votes = JSON.parse(localStorage.getItem(`${username}_${VOTE_ITEM}`.toLowerCase())) || []
            this.setState({ user: { username, votes }, loggedIn: true })
        }
    }

    handleLogout = () => {
        const possibleUsers = JSON.parse(localStorage.getItem(LOGIN_ITEM)) || []
        this.setState({ ...INITIAL_STATE, possibleUsers })
    }

    changeVote = votes => {
        this.setState({ user: { ...this.state.user, votes } })
        localStorage.setItem(`${this.state.user.username}_${VOTE_ITEM}`.toLowerCase(), JSON.stringify(votes))
    }

    clearStorage = () => this.setState(INITIAL_STATE, () => localStorage.clear())

    renderLogin = () => (
        <Container>
            <Form>
                <Form.Input size='massive' label='Name' placeholder='First name' onChange={this.handleChange} />
                <Form.Button size='massive' onClick={this.handleRegister} type='submit' color="orange">{this.state.possibleUsers.length !== 0 ? 'Register' : 'Login'}</Form.Button>
            </Form>
            {this.state.possibleUsers.length ? (
                <Segment inverted>
                    {this.state.possibleUsers.map(username =>
                        <Button inverted key={username} onClick={this.handleLogin(username)}> Login as {username}</Button>
                    )}
                    <Button color='purple' floated='right' onClick={this.clearStorage}> Clear cache (cannot change votes) </Button>
                </Segment>) : null
            }
        </Container>
    )


    renderDefault = () => (
        <Container>
            <h1> Hello {this.state.user.username} <Button floated="right" onClick={this.handleLogout} color="purple">Logout</Button></h1>
            <VotingView changeVote={this.changeVote} votes={this.state.user.votes} />
        </Container>
    )

    render = () => this.state.loggedIn ? this.renderDefault() : this.renderLogin()
}
