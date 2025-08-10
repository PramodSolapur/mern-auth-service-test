import request from 'supertest'
import app from '../../src/app'

describe('POST /auth/register', () => {
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
    })

    // Sad path
    describe('Fields are missing', () => {})
})
