// Import expressjwt middleware and GetVerificationKey type from express-jwt
import { expressjwt, GetVerificationKey } from 'express-jwt'
// Import jwksClient for retrieving signing keys from a JWKS endpoint
import jwksClient from 'jwks-rsa'
// Import Config object containing configuration values
import { Config } from '../config/config'
// Import Request type from express for type safety
import { type Request } from 'express'
import { AuthCookie } from '../types'

// Export the expressjwt middleware as the default export
export default expressjwt({
    // Configure the secret using JWKS endpoint for dynamic key retrieval
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!, // JWKS URI from config (non-null assertion)
        cache: true, // Enable caching of signing keys
        rateLimit: true, // Enable rate limiting for JWKS requests
    }) as GetVerificationKey, // Type assertion for GetVerificationKey
    algorithms: ['RS256'], // Specify accepted JWT signing algorithm(s)
    // Custom function to extract token from request
    getToken(req: Request) {
        const authHeader = req.headers.authorization // Get Authorization header
        // Check if Authorization header exists and token is not 'undefined'
        if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
            const token = authHeader.split(' ')[1] // Extract token from header
            if (token) {
                return token // Return token if present
            }
        }

        // Extract accessToken from cookies if not found in header
        const { accessToken } = req.cookies as AuthCookie
        return accessToken // Return accessToken from cookies
    },
})
