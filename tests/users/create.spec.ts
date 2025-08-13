import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'

describe('POST /tenants', () => {
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
        it('should return a 201 status code', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            }
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)
            expect(response.statusCode).toBe(201)
        })

        it('should create a tenant in the database', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            }
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            const tenantRepo = connection.getRepository(Tenant)
            const tenants = await tenantRepo.find()

            expect(tenants).toHaveLength(1)
            expect(tenants[0].name).toBe('tenant name')
            expect(tenants[0].address).toBe('tenant address')
        })

        it('should return 401 if user is not authenticated', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            }

            const res = await request(app).post('/tenants').send(tenantData)
            expect(res.statusCode).toBe(401)

            const tenantRepo = connection.getRepository(Tenant)
            const tenants = await tenantRepo.find()

            expect(tenants).toHaveLength(0)
        })

        it('should return 403 if user is not an admin', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            }

            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const res = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken};`])
                .send(tenantData)
            expect(res.statusCode).toBe(403)

            const tenantRepo = connection.getRepository(Tenant)
            const tenants = await tenantRepo.find()

            expect(tenants).toHaveLength(0)
        })
    })

    describe('Fields are missing ', () => {})
})
