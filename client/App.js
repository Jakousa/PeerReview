import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'
import { Container, Form, Button, Segment } from 'semantic-ui-react'

import ResultView from './ResultView'
import VotingView from './VotingView'
import { disconnectSocket } from './util/apiConnection'

const LOGIN_ITEM = 'users'

const INITIAL_STATE = {
    possibleUsers: [],
    user: { username: '', id: uuidv4() },
    loggedIn: false
}

class App extends Component {
    state = INITIAL_STATE

    componentDidMount() {
        const possibleUsers = JSON.parse(localStorage.getItem(LOGIN_ITEM)) || []
        if (possibleUsers) {
            this.setState({ possibleUsers })
        }
    }

    componentWillUnmount() {
        disconnectSocket()
    }

    handleChange = (e, { value: username }) => this.setState({ user: { ...this.state.user, username } })

    handleRegister = () => {
        const { user } = this.state
        if (user.username) {
            localStorage.setItem(LOGIN_ITEM, JSON.stringify([...this.state.possibleUsers, user]))
            this.setState({ loggedIn: true, user })
            this.props.login()
        }
    }

    handleLogin = uname => () => {
        const user = this.state.possibleUsers.find(user => uname === user.username)
        if (user) {
            this.setState({ user: user, loggedIn: true })
            this.props.login(user)
        }
    }

    handleLogout = () => {
        const possibleUsers = JSON.parse(localStorage.getItem(LOGIN_ITEM)) || []
        this.setState({ ...INITIAL_STATE, possibleUsers })
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
                    {this.state.possibleUsers.map(user =>
                        <Button inverted key={user.id} onClick={this.handleLogin(user.username)}> Login as {user.username}</Button>
                    )}
                    <Button color='purple' floated='right' onClick={this.clearStorage}> Clear cache (cannot change votes) </Button>
                </Segment>) : null
            }
        </Container>
    )


    renderDefault = () => (
        <Container>
            <h1> Hello {this.state.user.username} <Button floated="right" onClick={this.handleLogout} color="purple">Logout</Button></h1>
            {this.state.user.username === 'Monitor' || this.props.selectedGroup.id === "-1" ? <ResultView /> : <VotingView />}
        </Container>
    )

    render = () => this.state.loggedIn ? this.renderDefault() : this.renderLogin()
}

const mapStateToProps = ({ selectedGroup }) => ({ selectedGroup })

const mapDispatchToProps = dispatch => ({
    login: user => dispatch({ type: 'LOGIN_SUCCESS', user })
})


export default connect(mapStateToProps, mapDispatchToProps)(App)