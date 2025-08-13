import { checkSchema } from 'express-validator'

export default checkSchema({
    name: {
        trim: true,
        notEmpty: {
            errorMessage: 'name is missing',
            bail: true, // stop running validations if this fails
        },
    },
    address: {
        trim: true,
        notEmpty: {
            errorMessage: 'address is missing',
        },
    },
})
