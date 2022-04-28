import { model, Schema } from 'mongoose'
import { TUser } from '../types/user.types'
import { emailRegex, passwordRegex } from '../utils/regex'
const UsersSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'A User must have an email address.'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (this: TUser, value: string) {
                return !emailRegex.test(value)
            },
            message: 'Email is not valid.',
        },
    },
    password: {
        type: String,
        required: [true, 'A User must have a password.'],
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function (this: TUser, value: string) {
                return !passwordRegex.test(value)
            },
            message:
                'Invalid Password: Password must contain at least special character (#?!@$ %^&*-), 1 uppercase letter and 1 number',
        },
    },
    confirmPassword: {
        type: String,
        required: [true, 'A User must have a confirm password.'],
        minlength: [8, 'Confirm Password must be at least 8 characters'],
        validate: {
            validator: function (this: TUser, value: string) {
                return !(this.password === value)
            },
            message: 'Invalid Confirm Password: Passwords do not match',
        },
    },
})

const UserModel = model('users', UsersSchema)

export default UserModel
