import { NextFunction, Request, Response } from 'express'
import { Logger } from 'winston'
import { AuthRequest, RegisterUserRequest } from '../types/index'
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
                await this.tokenService.persistRefreshToken(user)

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
                await this.tokenService.persistRefreshToken(user)

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

            res.status(200).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async self(req: AuthRequest, res: Response, next: NextFunction) {
        const user = await this.userService.findById(Number(req.auth.sub))
        res.json({ ...user, password: undefined })
    }

    async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const user = await this.userService.findById(Number(req.auth.sub))

            if (!user) {
                const error = createHttpError(
                    401,
                    'User with this token could not find',
                )
                next(error)
                return
            }

            // Persist refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))

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
            this.logger.info('Assigned new access token to', { id: user.id })
            res.status(200).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))
            this.logger.info('User has been logged out', { id: req.auth.sub })
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.status(200).json({})
        } catch (error) {
            next(error)
            return
        }
    }
}
