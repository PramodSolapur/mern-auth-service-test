import app from './app'
import { Config } from './config/config'
import logger from './config/logger'

const startServer = () => {
    const port = Config.PORT || 5555
    try {
        app.listen(port, () => {
            logger.info(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer()
