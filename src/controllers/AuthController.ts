import { NextFunction, Response } from 'express'
import { Logger } from 'winston'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/userService'
import { validationResult } from 'express-validator'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { TokenService } from '../services/tokenService'
import { JwtPayload } from 'jsonwebtoken'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // Validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { firstName, lastName, email, password } = req.body

        this.logger.debug('New request to register a user', {
            firstName,
            lastName,
            email,
            password: '******',
        })
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })
            this.logger.info(`User has been registered`, { id: user.id })

            const payload: JwtPayload = {
                sub: user.id.toString(),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            // Persist refresh token
            const MS_IN_DAY = 1000 * 60 * 60 * 24

            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken)
            const newRefreshToken = await refreshTokenRepository.save({
                user,
                expiresAt: new Date(Date.now() + MS_IN_DAY),
            })

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true, // very imp
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24, // 1d
                httpOnly: true,
            })

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
