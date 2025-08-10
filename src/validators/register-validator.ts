import { checkSchema } from 'express-validator'

// export default [
//     body('email')
//         .notEmpty()
//         .withMessage('Email is required')
//         .isEmail()
//         .withMessage('Invalid email id'),
// ]

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
    firstName: {
        trim: true,
        notEmpty: {
            errorMessage: 'First name is missing',
        },
    },
    lastName: {
        trim: true,
        notEmpty: {
            errorMessage: 'Last name is missing',
        },
    },
    password: {
        trim: true,
        notEmpty: {
            errorMessage: 'Password is missing',
        },
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password length should be 8 chars',
        },
    },
})
