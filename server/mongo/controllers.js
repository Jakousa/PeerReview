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