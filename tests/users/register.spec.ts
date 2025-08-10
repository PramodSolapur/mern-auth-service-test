import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { truncateTables } from '../utils'

describe('POST /auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection)
    })

    afterAll(async () => {
        // Close connection
        await connection.destroy()
    })

    // Happy path
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // Formula to write test cases AAA
            // Arrange
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@gmail.com',
                password: 'secret',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@gmail.com',
                password: 'secret',
            }
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            )
        })

        it('should persist the user in the db', async () => {
            // Arrange
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@gmail.com',
                password: 'secret',
            }
            // Act
            await request(app).post('/auth/register').send(userData)

            // Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
            expect(users[0].password).toBe(userData.password)
        })
    })

    // Sad path
    describe('Fields are missing', () => {})
})
