import React, { Component } from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'

import { listHeader } from './util/common'

const feedback = group => {
    if (!group.feedback || group.feedback.length === 0) return <Menu.Item> No feedback yet </Menu.Item>

    return group.feedback.map(feedback => <Menu.Item key={feedback._id}>{feedback.text}</Menu.Item>)
}

const FeedbackView = ({ editGroup, close, group }) => {
    if (!group) return null
    return (
        <Sidebar
            as={Menu}
            animation='overlay'
            width='very wide'
            direction='right'
            visible={!!group}
            icon='labeled'
            vertical>
            <Menu.Item name='title'>
                {listHeader(group)}
            </Menu.Item>
            <Menu.Item name='close' onClick={close}>
                Close this sidebar
                </Menu.Item>
            <Menu.Item name='edit' onClick={editGroup}>
                Open team editor below
                </Menu.Item>
            <Menu.Item active name='feedback'>
                Feedback below:
                </Menu.Item>
            {feedback(group)}
        </Sidebar>
    )
}

export default FeedbackView