import createHttpError from 'http-errors'
import jwt, { JwtPayload } from 'jsonwebtoken'
import fs from 'node:fs'
import path from 'node:path'
import { Config } from '../config/config'
import { User } from '../entity/User'
import { RefreshToken } from '../entity/RefreshToken'
import { Repository } from 'typeorm'

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, '../../certs/private.pem'),
            )
        } catch (err) {
            const error = createHttpError(
                500,
                'Error while reading private key',
            )
            throw error
        }

        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        })
        return accessToken
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1d',
            issuer: 'Auth-Service',
            jwtid: String(payload.id),
        })
        return refreshToken
    }

    async persistefreshToken(user: User) {
        const MS_IN_DAY = 1000 * 60 * 60 * 24
        const newRefreshToken = await this.refreshTokenRepository.save({
            user,
            expiresAt: new Date(Date.now() + MS_IN_DAY),
        })
        return newRefreshToken
    }
}
