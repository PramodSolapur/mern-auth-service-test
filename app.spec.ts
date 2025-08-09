import app from './src/app'
import { calculateDiscount } from './src/util'
import request from 'supertest'

describe('App', () => {
    it('Should calculate the discount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(10)
    })

    it('should return status 200', () => {
        request(app).get('/').expect(200)
    })
})
