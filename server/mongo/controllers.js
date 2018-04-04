import Group from './Group'

export const getGroups = async (req, res) => {
    const groups = await Group.find()
    res.json(groups.map(Group.format)).status(200).end()
}

export const addGroup = async (req, res) => {
    const { groupName, projectTitle, members, groupId } = req.body
    let newGroup
    if (!groupId) {
        newGroup = await Group.create({ groupName, projectTitle, members })
    } else {
        newGroup = await Group.findByIdAndUpdate(groupId, { groupName, projectTitle, members }, { new: true })
    }
    res.status(200).json(Group.format(newGroup)).end()
}

export const handleVote = (io) => async (req, res) => {
    const { groupId } = req.params;
    const vote = req.body
    let newVote;
    if (vote.id) {
        await Group.updateOne({
            _id: groupId,
            "votes._id": vote.id
        },
            { $set: { "votes.$.value": vote.value } },
            { upsert: true }, )
        newVote = vote
    } else {
        const group = await Group.findByIdAndUpdate(groupId,
            { $push: { votes: { value: vote.value } } },
            { new: true }, )
        const { _id: id, value } = group.votes[group.votes.length - 1]
        newVote = { id, value }
    }
    res.status(200).json(newVote).end()

    const groups = await Group.find()
    io.emit('VOTE', groups.map(Group.format))
}