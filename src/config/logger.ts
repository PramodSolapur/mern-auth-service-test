import winston from 'winston'
import { Config } from './config'

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'auth-service',
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: 'log',
            filename: 'combined.log',
            level: 'info', //  It is going to store info, warn and error logs
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            dirname: 'log',
            filename: 'error.log',
            level: 'error',
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            silent: Config.NODE_ENV === 'test',
        }),
    ],
})

export default logger
