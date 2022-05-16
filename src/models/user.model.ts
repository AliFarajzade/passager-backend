import bcryptjs from 'bcryptjs'
import { model, Schema } from 'mongoose'
import { TUser } from '../types/user.types'
import { emailRegex, passwordRegex } from '../utils/regex'

const UserSchema = new Schema({
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
                return emailRegex.test(value)
            },
            message: 'Email is not valid.',
        },
    },
    password: {
        type: String,
        required: [true, 'A User must have a password.'],
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            // This will only work on create and save method.
            validator: function (this: TUser, value: string) {
                return passwordRegex.test(value)
            },
            message:
                'Invalid Password: Password must contain at least special character (#?!@$ %^&*-), 1 uppercase letter and 1 number',
        },
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'A User must have a confirm password.'],
        minlength: [8, 'Confirm Password must be at least 8 characters'],
        validate: {
            // This will only work on create and save method.
            validator: function (this: TUser, value: string) {
                return this.password === value
            },
            message: 'Invalid Confirm Password: Passwords do not match',
        },
    },
    passwordChangedAt: {
        type: Date,
        required: false,
    },
})

// Document Middleware
UserSchema.pre(
    'save',
    async function (
        this: TUser & { isModified: (field: string) => boolean },
        next
    ) {
        // If the password being initialize or change.
        if (!this.isModified?.('password')) return next()

        // Hashing the password
        this.password = await bcryptjs.hash(this.password, 12)

        this.confirmPassword = undefined
        next()
    }
)

UserSchema.methods.comparePasswords = async (
    requestPassword: string,
    hashedPassword: string
) => await bcryptjs.compare(requestPassword, hashedPassword)

UserSchema.methods.hasPasswordChange = function (
    this: TUser,
    JWTIssuedAt: number
) {
    if (!this.passwordChangedAt) return false
    else
        return (
            new Date(`${this.passwordChangedAt}`).getTime() / 1000 > JWTIssuedAt
        )
}

const UserModel = model('users', UserSchema)

export default UserModel
