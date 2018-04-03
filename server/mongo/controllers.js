import Group from './Group'

export const getGroups = async (req, res) => {
    const groups = await Group.find()
    res.json(groups.map(Group.format)).status(200).end()
}

export const addGroup = async (req, res) => {
    const { groupName, projectTitle, members } = req.body
    const newGroup = await Group.create({ groupName, projectTitle, members })
    res.status(200).json(Group.format(newGroup)).end()
}

export const handleVote = async (req, res) => {
    const { groupId } = req.params;
    const vote = req.body
    if (vote.id) {
        await Group.updateOne({
            _id: groupId,
            "votes._id": vote.id
        },
            { $set: { "votes.$.value": vote.value } },
            { upsert: true }, )
        res.status(200).json(vote).end()
    } else {
        const group = await Group.findByIdAndUpdate(groupId,
            { $push: { votes: { value: vote.value } } },
            { new: true }, )
        const { _id: id, value } = group.votes[group.votes.length - 1]
        res.status(200).json({ id, value }).end()
    }
}