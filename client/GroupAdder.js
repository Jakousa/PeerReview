import React, { Component } from 'react'
import { Form, Button, Segment, Icon, List, Message } from 'semantic-ui-react'

const INITIAL_STATE = {
    open: false,
    groupName: '',
    projectTitle: '',
    memberName: '',
    members: [],
    error: '',
}

export default class GroupAdder extends Component {
    state = INITIAL_STATE

    componentWillReceiveProps(nextProps) {
        if (nextProps.group) {
            const { groupName, projectTitle, members } = nextProps.group
            this.setState({ open: true, groupName, projectTitle, members })
        }
    }

    toggleOpen = () => this.setState({ ...INITIAL_STATE, open: !this.state.open }, this.props.clearSelect())

    handleChange = (e, { name, value }) => this.setState({ [name]: value, error: '' })

    addMember = () => {
        const { memberName, members } = this.state
        if (memberName) {
            this.setState({
                memberName: '',
                members: [...members, memberName]
            })
        }
    }

    removeMember = (member) => () => this.setState({ members: this.state.members.filter(one => one !== member) })

    addGroup = () => {
        const { members, groupName, projectTitle } = this.state
        if (!groupName && !projectTitle) {
            this.setState({ error: 'Add either project title OR group name!' })
        } else if (members.length === 0) {
            this.setState({ error: 'Add atleast 1 member!' })
        } else {
            if (this.props.group) {
                this.props.addGroup({ groupName, projectTitle, members, groupId: this.props.group.id })
            } else {
                this.props.addGroup({ groupName, projectTitle, members })
            }
            this.toggleOpen()
        }
    }

    renderForm = () => {
        const { groupName, projectTitle, memberName, members, error: formError } = this.state
        return (
            <Segment inverted>
                <Form inverted error>
                    <Form.Group widths='equal'>
                        <Form.Input fluid label='Project title' placeholder='Project title' name={'projectTitle'} value={projectTitle} onChange={this.handleChange} />
                        <Form.Input fluid label='Group name' placeholder='Group name' name={'groupName'} value={groupName} onChange={this.handleChange} />
                    </Form.Group>
                    <label> Members: </label>
                    <List divided relaxed horizontal inverted>
                        {members.map(member => (
                            <List.Item key={member}>
                                <List.Icon name='user' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Description as='a'>{member}</List.Description>
                                </List.Content>
                                <List.Content floated='right'>
                                    <List.Icon name='close' verticalAlign='middle' onClick={this.removeMember(member)} />
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                    <Form.Input type="text" placeholder="Name" action name={'memberName'} value={memberName} onChange={this.handleChange}>
                        <input />
                        <Button color="orange" type='submit' onClick={this.addMember}>
                            <Icon name='add user' />
                            Add member
                        </Button>
                    </Form.Input>
                    <Form.Group floated="right">
                        <Form.Button inverted width={16} fluid color="orange" onClick={this.addGroup}>
                            {this.props.group ? 'Edit group' : 'Add group'}
                        </Form.Button>
                        <Form.Button inverted color="purple" onClick={this.toggleOpen}>Cancel</Form.Button>
                    </Form.Group>
                    {formError ?
                        <Message
                            error
                            header='Action Forbidden'
                            content={formError}
                        /> : null}
                </Form>
            </Segment>
        )
    }

    renderButton = () => (
        <Button color="orange" onClick={this.toggleOpen}>
            Group is missing?
        </Button>
    )

    render = () => this.state.open ? this.renderForm() : this.renderButton()
}