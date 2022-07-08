import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { model, PreMiddlewareFunction, Schema } from 'mongoose'
import { TUser } from '../types/user.types'
import { emailRegex, passwordRegex } from '../utils/regex'

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A user must have a name'],
        minlength: 2,
        maxlength: 32,
        validate: {
            validator: (value: string) =>
                !value.split('').every(char => !!parseInt(char)),
            message: 'Name must only contain english letters.',
        },
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'A User must have an email address.'],
        unique: true,
        lowercase: true,
        validate: {
            validator: (value: string) => emailRegex.test(value),
            message: 'Email is not valid.',
        },
    },
    password: {
        type: String,
        required: [true, 'A User must have a password.'],
        minlength: [8, 'Password must be at least 8 characters'],
        validate: {
            // This will only work on create and save method.
            validator: (value: string) => passwordRegex.test(value),
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
    photo: String,
    role: {
        type: String,
        enum: {
            values: ['user', 'guide', 'lead-guide', 'admin'],
            message:
                'Rules can only be "user", "guide", "lead-guide" and "admin".',
        },
        default: 'user',
    },
    description: String,
    hashedResetPasswordToken: String,
    resetPasswordTokenExpireTime: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

const documentMiddlewareHashPassword: PreMiddlewareFunction = async function (
    this,
    next
) {
    // If the password being initialize or change.
    if (!this.isModified?.('password')) return next()

    // Hashing the password
    this.password = await bcryptjs.hash(this.password!, 12)

    this.confirmPassword = undefined
    next()
}

const documentMiddlewareAddPasswordChagendAt: PreMiddlewareFunction =
    async function (this, next) {
        if (!this.isModified?.('password') || this.isNew) return next()

        this.passwordChangedAt = Date.now() - 1000

        next()
    }

const queryMiddlewareExcludeInActiveUsers: PreMiddlewareFunction = function (
    this,
    next
) {
    this.find({ active: { $ne: false } })
    next()
}

// Document Middleware
UserSchema.pre('save', documentMiddlewareHashPassword)

UserSchema.pre('save', documentMiddlewareAddPasswordChagendAt)

// Query middleware
UserSchema.pre(/^find/, queryMiddlewareExcludeInActiveUsers)

// Schema methods
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

UserSchema.methods.createPasswordResetToken = function (this: TUser) {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.hashedResetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordTokenExpireTime = Date.now() + 10 * 60 * 1000

    return resetToken
}

const UserModel = model('User', UserSchema, 'users')

export default UserModel
