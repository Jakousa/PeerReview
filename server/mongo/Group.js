import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema({
    groupName: String,
    projectTitle: String,
    members: [String],
    votes: [{
        value: Number
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
