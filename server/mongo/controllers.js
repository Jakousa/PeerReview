import Group from './Group'

export const getGroups = async (req, res) => {
    const groups = await Group.find()
    res.json(groups.map(Group.format)).status(200)
}

export const addGroup = async (req, res) => {
    const { groupName, projectTitle, members, groupId } = req.body
    let newGroup
    if (!groupId) {
        newGroup = await Group.create({ groupName, projectTitle, members })
    } else {
        newGroup = await Group.findByIdAndUpdate(groupId, { groupName, projectTitle, members }, { new: true })
    }
    res.json(Group.format(newGroup)).status(200)
}

export const handleVote = (io) => async (req, res) => {
    const { groupId } = req.params;
    const userId = req.headers.user
    const vote = req.body
    let newVote;
    if (vote._id) {
        await Group.updateOne({
            _id: groupId,
            "votes._id": vote._id
        },
            { $set: { "votes.$.value": vote.value } },
            { upsert: true }, )
        newVote = vote
    } else {
        const group = await Group.findByIdAndUpdate(groupId,
            { $push: { votes: { value: vote.value, voter: userId } } },
            { new: true }, )
        const { _id, value } = group.votes[group.votes.length - 1]
        newVote = { _id, value }
    }
    newVote.voter = userId
    res.json({ vote: newVote, groupId }).status(200)

    const groups = await Group.find()
    io.emit('VOTE', groups.map(Group.format))
}