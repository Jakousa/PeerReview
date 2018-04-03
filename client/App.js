import React, { Component } from 'react'
import { Container, Form, Button } from 'semantic-ui-react'
import VotingView from './VotingView'
import uuidv4 from 'uuid'

const LOGIN_ITEM = 'user'
const INITIAL_STATE = {
    user: { username: '', id: undefined },
    loggedIn: false
}

export default class App extends Component {
    state = INITIAL_STATE

    componentDidMount = () => {
        const user = JSON.parse(localStorage.getItem(LOGIN_ITEM))
        if (user) {
            this.setState({ user, loggedIn: true })
        }
    }

    handleChange = (e, { value: username }) => this.setState({ user: { ...this.state.user, username } })

    handleLogin = () => {
        const { user } = this.state
        if (user.username) {
            user.id = uuidv4()
            this.setState({ loggedIn: true, user })
            localStorage.setItem(LOGIN_ITEM, JSON.stringify(user))
        }
    }

    handleLogout = () => this.setState(INITIAL_STATE, () => localStorage.clear())

    renderLogin = () => (
        <Container>
            <Form>
                <Form.Input size='massive' label='Name' placeholder='First name' onChange={this.handleChange} />
            </Form>
            <Form.Button size='massive' onClick={this.handleLogin} color="orange">Login</Form.Button>
        </Container>
    )

    renderDefault = () => (
        <Container>
            <h1> Hello {this.state.user.username} <Button floated="right" onClick={this.handleLogout} color="purple">Logout</Button></h1>
            <VotingView />
        </Container>
    )

    render = () => this.state.loggedIn ? this.renderDefault() : this.renderLogin()
}
