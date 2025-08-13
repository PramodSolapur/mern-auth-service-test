import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/userService'
import { CreateUserRequest } from '../types'
import { Roles } from '../constants'

export class UserController {
    constructor(private userService: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, password, email } = req.body

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                password,
                email,
                role: Roles.MANAGER,
            })
            res.status(201).json({ is: user.id })
        } catch (error) {
            next(error)
        }
    }
}
