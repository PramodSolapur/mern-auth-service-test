import { Router } from 'express'
import { json } from 'stream/consumers'

const router = Router()

router.post('/', (req, res, next) => {
    res.status(201).json({})
})

export default router
