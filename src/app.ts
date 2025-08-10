import 'reflect-metadata'
import express, {
    type Request,
    type Response,
    type NextFunction,
} from 'express'
import { HttpError } from 'http-errors'
import authRouter from './routes/auth'

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to Auth-Service')
})

app.use('/auth', authRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
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
