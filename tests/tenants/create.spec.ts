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

        it('should return 200 status code', async () => {
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

            const res = await request(app).get('/tenants').send()

            const tenantRepo = connection.getRepository(Tenant)
            const tenants = await tenantRepo.find()

            expect(res.statusCode).toBe(200)
            expect(tenants).toHaveLength(1)
        })

        it('should return 404 status code if tenant not found', async () => {
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

            const res = await request(app)
                .get('/tenants/2')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send()

            expect(res.statusCode).toBe(404)
        })

        it('should return 200 status code if tenant found', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const tenant = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            const res = await request(app)
                .get('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send()

            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.findOne({ where: { id: 1 } })

            expect(res.statusCode).toBe(200)
            expect((tenant.body as Record<string, string>)['id']).toBe(data?.id)
        })

        it('should return 200 status code if tenant updated', async () => {
            const tenantData = {
                name: 'tenant name',
                address: 'tenant address',
            }

            const updatedTenantData = {
                name: 'update tenant name',
                address: 'update tenant address',
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            const res = await request(app)
                .patch('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(updatedTenantData)

            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.findOne({ where: { id: 1 } })

            expect(res.statusCode).toBe(200)
            expect(data?.name).toBe('update tenant name')
            expect(data?.address).toBe('update tenant address')
        })

        it('should return 200 status code if tenant deleted', async () => {
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

            const res = await request(app)
                .delete('/tenants/1')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send()

            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.find()

            expect(res.statusCode).toBe(200)
            expect(data).toHaveLength(0)
        })
    })

    describe('Fields are missing ', () => {
        it('should return 400 status code is name is missing', async () => {
            const tenantData = {
                name: '',
                address: 'tenant address',
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const res = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            expect(res.statusCode).toBe(400)
        })

        it('should return 400 status code is address is missing', async () => {
            const tenantData = {
                name: '',
                address: '',
            }

            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const res = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            expect(res.statusCode).toBe(400)
        })
    })
})
