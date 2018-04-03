import React, { Component } from 'react'
import Plot from 'react-plotly.js';

const barName = (group) => {
    if (group.projectTitle) {
        return group.projectTitle
    }
    return group.groupName
}

const groupsToValidData = (groups) => {
    const data = { type: 'bar', orientation: 'h' }
    const x = []
    const y = []
    groups.forEach(group => {
        y.push(barName(group))
        x.push(group.votes.reduce((prev, cur) => cur.value + prev, 0))
    })
    data.x = x
    data.y = y
    return data
}

const GroupGraph = ({ groups }) => (
    <Plot style={{ width: 'auto'}}
        data={[
            groupsToValidData(groups),
        ]}
    />
)

export default GroupGraph