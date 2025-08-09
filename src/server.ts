function welcome(name: string) {
    const user = {
        name: 'pramod',
    }
    const username = user['name']
    return name + username
}

welcome('pramod')
