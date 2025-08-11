import createHttpError from 'http-errors'
import jwt, { JwtPayload } from 'jsonwebtoken'
import fs from 'node:fs'
import path from 'node:path'
import { Config } from '../config/config'

export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer

        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, '../../certs/private.pem'),
            )
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}
