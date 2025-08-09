import app from './app'
import { Config } from './config/config'

const startServer = () => {
    const port = Config.PORT || 5555
    try {
        app.listen(port, () => {
            console.log(`server is running on port ${port}`)
            // logger.info(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer()
