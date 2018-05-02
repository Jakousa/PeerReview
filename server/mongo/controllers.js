import Group from './Group'

export const getGroups = async (req, res) => {
    const groups = await Group.find()
    res.json(groups.map(Group.format)).status(200)
}

export const addGroup = io => async (req, res) => {
    const { groupName, projectTitle, members, groupId } = req.body
    let newGroup
    if (!groupId) {
        newGroup = await Group.create({ groupName, projectTitle, members })
    } else {
        newGroup = await Group.findByIdAndUpdate(groupId, { groupName, projectTitle, members }, { new: true })
    }
    res.json(Group.format(newGroup)).status(200)

    const groups = await Group.find()
    io.emit('GROUPS', groups.map(Group.format))
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
    io.emit('GROUPS', groups.map(Group.format))
}

const selectedGroup = { id: "-1" }

export const getSelectedGroup = async (req, res) => {
    if (!selectedGroup.id) {
        return res.status(204).end()
    }
    return res.json(selectedGroup).status(200)
}

export const selectGroup = (io) => async (req, res) => {
    const { groupId } = req.params
    if (!groupId) {
        return res.status(400).end()
    }
    selectedGroup.id = groupId
    res.status(202).end()

    io.emit('SELECT', selectedGroup)
}

export const handleFeedback = (io) => async (req, res) => {
    const { groupId } = req.params
    const userId = req.headers.user
    const feedback = req.body
    if (!groupId) {
        return res.status(400).end()
    }
    await Group.findByIdAndUpdate(groupId,
        { $push: { feedback: { text: feedback.text, voter: userId } } },
        { new: true }, )

    res.status(202).end()

    const groups = await Group.find()
    io.emit('GROUPS', groups.map(Group.format))
}