export const listHeader = (group) => {
    if (!group) return ''
    let header = ''
    if (group.projectTitle) {
        header += group.projectTitle
    }
    if (group.projectTitle && group.groupName) {
        header += ', by '
    }
    if (group.groupName) {
        header += group.groupName
    }
    return header
}

export const getVotingOptions = () => {
    const options = []
    for (let index = 0; index <= 10; index++) {
        options.push({ key: index, value: index, text: index })
    }
    return options
}