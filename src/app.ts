import express, { type Request, type Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Auth-Service')
})

export default app
