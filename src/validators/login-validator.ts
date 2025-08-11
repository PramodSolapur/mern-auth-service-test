import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        trim: true,
        notEmpty: {
            errorMessage: 'Email is required',
            bail: true, // stop running validations if this fails
        },
        isEmail: {
            errorMessage: 'Invalid email id',
        },
    },
    password: {
        trim: true,
        notEmpty: {
            errorMessage: 'Password is missing',
        },
    },
})
