import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema({
    groupName: String,
    projectTitle: String,
    members: [String],
    votes: [{
        voter: String,
        value: Number
    }],
    feedback: [{
        voter: String,
        text: String
    }]
})

groupSchema.statics.format = (group) => {
    const {
        _id: id, groupName, projectTitle, members, votes
    } = group
    return {
        id,
        groupName,
        projectTitle,
        members,
        votes
    }
}
const Group = mongoose.model('Group', groupSchema)

export default Group
