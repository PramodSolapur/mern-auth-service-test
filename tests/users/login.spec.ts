import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { isJwt } from '../../src/util'
import bcrypt from 'bcrypt'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'

describe('POST /auth/login', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return access and refresh token if user exists', async () => {
            // Arrange
            const userData = {
                firstName: 'chiku',
                lastName: 'mandi',
                email: 'chiku@gmail.com',
                password: 'secret',
            }

            const hashPassword = await bcrypt.hash(userData.password, 10)

            const userRepository = AppDataSource.getRepository(User)
            await userRepository.save({
                ...userData,
                password: hashPassword,
                role: Roles.CUSTOMER,
            })

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'chiku@gmail.com', password: 'secret' })

            // Assert
            let accessToken = null
            let refreshToken = null

            const cookies = response.headers['set-cookie'] || []

            if (Array.isArray(cookies)) {
                cookies.forEach((cookie: string) => {
                    if (cookie.startsWith('accessToken=')) {
                        accessToken = cookie.split(';')[0].split('=')[1]
                    }

                    if (cookie.startsWith('refreshToken=')) {
                        refreshToken = cookie.split(';')[0].split('=')[1]
                    }
                })
            }

            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()

            expect(isJwt(accessToken)).toBeTruthy()
            expect(isJwt(refreshToken)).toBeTruthy()
        })

        it('should return 400 if email or password is wrong', async () => {
            // Arrange
            const userData = {
                firstName: 'pramod',
                lastName: 'solapur',
                email: 'pamm@gmail.com',
                password: 'secret',
            }

            const hashPassword = await bcrypt.hash(userData.password, 10)

            const userRepository = AppDataSource.getRepository(User)
            await userRepository.save({
                ...userData,
                password: hashPassword,
                role: Roles.CUSTOMER,
            })

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'chiku@gmail.com', password: 'secret' })

            // Assert
            expect(response.statusCode).toBe(400)
        })
    })

    describe('Fields are missing ', () => {
        it('should return 400 status code if email is missing', async () => {
            // Arrange
            const userData = {
                email: '',
                password: 'secret',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
        })

        it('should return 400 status code if password is missing', async () => {
            // Arrange
            const userData = {
                email: 'chiku@gmail.com',
                password: '',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
        })
    })
})
