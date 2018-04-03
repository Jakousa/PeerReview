import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema({
    groupName: String,
    projectTitle: String,
    members: [String]
})

groupSchema.statics.format = (group) => {
    const {
        _id: id, groupName, projectTitle, members,
    } = group
    return {
        id,
        groupName,
        projectTitle,
        members
    }
}
const Group = mongoose.model('Group', groupSchema)

export default Group
