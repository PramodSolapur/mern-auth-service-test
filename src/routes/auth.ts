import express from 'express'
import { AuthController } from '../controllers/AuthController'

const router = express.Router()

const authController = new AuthController()

// Passed arrow to solve this binding issue
router.post('/register', (req, res) => authController.register(req, res))

export default router
