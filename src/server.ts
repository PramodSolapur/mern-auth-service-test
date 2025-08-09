import { Config } from './config/config'

function welcome(name: string) {
    const user = {
        name: 'pramod',
    }
    const username = user['name']
    return name + username + Config.PORT
}

console.log(welcome('pramod'))
