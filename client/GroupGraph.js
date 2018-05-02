import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ResponsiveContainer, Cell, BarChart, XAxis, Tooltip, Bar, Text, LabelList } from 'recharts'

// string to colour from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
const stringToColour = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

const barName = (group) => {
    if (group.projectTitle) {
        return group.projectTitle
    }
    return group.groupName
}

const groupsToValidData = groups => groups.map(group => ({
    name: barName(group),
    score: group.votes.reduce((prev, cur) => cur.value + prev, 0)
})).sort((a, b) => b.score - a.score)

const GroupGraph = ({ chartData }) => (
    <ResponsiveContainer>
        <BarChart
            data={chartData}
        >
            <Bar dataKey="score" fill="navy" >
                <LabelList dataKey="name" position="bottom" />

                {chartData.map(bar => (
                    <Cell
                        key={bar.name}
                        fill={stringToColour(bar.name)}
                    />
                ))}
            </Bar>
            <XAxis dataKey="name" tick={false} />
            <Tooltip />
        </BarChart>
    </ResponsiveContainer>
)

const mapStateToProps = ({ groups }) => ({
    chartData: groupsToValidData(groups)
})

export default connect(mapStateToProps)(GroupGraph)