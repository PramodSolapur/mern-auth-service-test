import { DataSource } from 'typeorm'
import request from 'supertest'
import createJWKSMock from 'mock-jwks'

import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import { createTenant } from '../utils'
import { Tenant } from '../../src/entity/Tenant'

describe('POST /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:7777')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterEach(async () => {
        await jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should persist the user in the database', async () => {
            // create tenant first
            const tenant = await createTenant(connection.getRepository(Tenant))

            // Register user
            const userData = {
                firstName: 'john',
                lastName: 'dow',
                email: 'john@mern.space',
                password: 'password',
                tenantId: tenant.id,
                role: Roles.MANAGER,
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            // Add token to cookie
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            // Assert
            expect(response.statusCode).toBe(201)
            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(userData.email)
        })

        it('should create a manager user', async () => {
            // Register user
            const userData = {
                firstName: 'john',
                lastName: 'dow',
                email: 'john@mern.space',
                password: 'password',
                tenantId: 1,
                role: Roles.MANAGER,
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            // Add token to cookie
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            // Assert
            expect(users).toHaveLength(1)
            expect(users[0].role).toBe(Roles.MANAGER)
        })

        it('should return 403 if non admin user tries to create a user', async () => {
            // Create tenant first
            const tenant = await createTenant(connection.getRepository(Tenant))

            const nonAdminToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
                tenantId: tenant.id,
            }

            // Add token to cookie
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${nonAdminToken}`])
                .send(userData)

            expect(response.statusCode).toBe(403)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(0)
        })
    })
})
