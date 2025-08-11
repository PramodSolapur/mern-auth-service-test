import { NextFunction, Response } from 'express'
import { Logger } from 'winston'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/userService'
import { validationResult } from 'express-validator'
import { TokenService } from '../services/tokenService'
import { JwtPayload } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { CredentialService } from '../services/credentialService'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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
            const newRefreshToken =
                await this.tokenService.persistefreshToken(user)

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
            this.logger.info('User has been registered in', { id: user.id })
            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { email, password } = req.body

        this.logger.debug('New request to login a user', {
            email,
            password: '******',
        })

        try {
            const user = await this.userService.findByEmail(email)

            if (!user) {
                const error = createHttpError(
                    400,
                    'Email or password does not match',
                )
                next(error)
                return
            }

            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            )

            if (!passwordMatch) {
                const err = createHttpError(
                    400,
                    'Email or password does not match',
                )
                next(err)
                return
            }

            const payload: JwtPayload = {
                sub: user.id.toString(),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            // Persist refresh token
            const newRefreshToken =
                await this.tokenService.persistefreshToken(user)

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

            this.logger.info('User has been logged in', { id: user.id })

            res.status(201).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
