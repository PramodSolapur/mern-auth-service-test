import 'reflect-metadata'
import express, {
    type Request,
    type Response,
    type NextFunction,
} from 'express'
import cookieParser from 'cookie-parser'
import { HttpError } from 'http-errors'
import authRouter from './routes/auth'
import logger from './config/logger'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to Auth-Service')
})

app.use('/auth', authRouter)

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                message: err.message || 'Something went wrong',
                path: '',
                location: '',
            },
        ],
    })
})

export default app
