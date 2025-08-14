import { config } from 'dotenv'
import path from 'path'
config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
})
import app from './app'
import { Config } from './config/config'
import { AppDataSource } from './config/data-source'
import logger from './config/logger'

const startServer = async () => {
    const port = Config.PORT || 5555
    try {
        await AppDataSource.initialize()
        logger.info('Database connected successfully')
        app.listen(port, () => {
            logger.info(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

void startServer()
