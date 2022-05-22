/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Query } from 'mongoose'
import UserModel from '../models/user.model'
import { TJWTDecodedType, TUser } from '../types/user.types'
import AppError from '../utils/app-error.class'
import { sendEmail } from '../utils/email.helper'
import { emailRegex } from '../utils/regex'
import { catchAsync } from './error.controller'

const generateToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE_TIME as string,
    })

const sendToken = (
    userId: string,
    res: Response,
    user: Record<string, never> | TUser = {}
) => {
    const token = generateToken(userId)
    const cookieOptions: Record<string, unknown> = {
        expires: new Date(
            Date.now() +
                (process.env.JWT_COOKIE_EXPIRE_TIME as unknown as number) *
                    24 *
                    60 *
                    60 *
                    1000
        ),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions)

    if (Object.keys(user).length) {
        user.password = undefined
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user,
            },
        })
    } else
        res.status(201).json({
            status: 'success',
            token,
        })
}

export const signUpUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
            photo: req.body.photo,
        }

        const newUser = await UserModel.create(data)

        sendToken(newUser._id, res, newUser)
    }
)

export const logInUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        // 1) Check for email and password existence.
        if (!email || !password)
            return next(new AppError('Please provide email and password.', 400))

        // 2) Check if user exist and password is correct.
        const user = await UserModel.findOne({ email }).select('+password')
        const match = !!(await user?.comparePasswords(password, user.password))

        if (!user || !match)
            return next(new AppError('Incorrect email or password.', 401))

        // 3) Send token to client if everything is ok.

        sendToken(user._id, res)
    }
)

export const protectRoute = catchAsync(
    // prettier-ignore
    async (req: (Request & Partial<{currentUser: TUser}>), _: Response, next: NextFunction) => {
        let token = ''

        // 1) Check for JWT existence
        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer') ||
            !req.headers.authorization.split(' ')[1]
        )
            return next(
                new AppError('You are unauthorized! Please log in first', 401)
            )

        token = req.headers.authorization.split(' ')[1]

        // 2) Check for JWT validation
        const { id, iat } = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as TJWTDecodedType & JwtPayload

        // 3) Check if user still exists
        const user = await UserModel.findById(id).select('+password')
        if (!user)
            return next(
                new AppError(
                    'There is no account corresponding to this ID.',
                    401
                )
            )

        // 4) Check if user changed the password since token generation
        const hasPasswordChanged = user.hasPasswordChange(iat)
        if (hasPasswordChanged)
            return next(
                new AppError(
                    'Password has changed since the token was generated, please log in again.',
                    401
                )
            )

        req.currentUser = user
        next()
    }
)

// Authorization middleware
export const restrictTo = (...roles: string[]) =>
    catchAsync(
        async (
            req: Request & Partial<{ currentUser: TUser }>,
            res: Response,
            next: NextFunction
        ) => {
            if (!req.currentUser)
                return next(new AppError('You are not authenticated.', 401))
            if (!roles.includes(req.currentUser.role))
                return next(
                    new AppError(
                        "You don't have permission to perfom this action.",
                        403
                    )
                )

            next()
        }
    )

export const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body

        // 1) Check for email existence and format validation
        if (!email || !emailRegex.test(email))
            return next(new AppError('Please provide a valid email.', 400))

        // 2) Check for email exsitence in db
        const user = await UserModel.findOne({ email })
        if (!user) return next(new AppError('This user does not exist.', 404))

        // 3) Generate a token and save it to db
        const resetToken = user.createPasswordResetToken() as string
        await user.save({ validateBeforeSave: false })

        // 4) Send the token to user's email
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`

        const message = `Forgot your Password? Submit a PATCH request with your new password and password confirm to: ${resetURL}.\n Please ignore if this is not your request.`

        try {
            await sendEmail({
                to: user.email,
                subject: 'Forgot password',
                text: message,
            })

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email successfully.',
            })
        } catch (error) {
            user.hashedResetPasswordToken = undefined
            user.resetPasswordTokenExpireTime = undefined
            await user.save({ validateBeforeSave: false })
            return next(
                new AppError('Could not send the email at the moment.', 500)
            )
        }
    }
)
export const resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { password, confirmPassword } = req.body
        const { token } = req.params
        // 1) Check if there is a password and confirm password.
        if (!password || !confirmPassword)
            return next(
                new AppError(
                    'Please provide password and confirm password.',
                    400
                )
            )

        // 2) Check if there is a user with this token. Check the token expire time
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')

        const user = (await UserModel.findOne({
            hashedResetPasswordToken: hashedToken,
            resetPasswordTokenExpireTime: { $gt: Date.now() },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as Query<any, any, Record<string, never>, any> &
            TUser & { save: () => Promise<unknown> }

        if (!user)
            return next(
                new AppError('Token is either invalid or has expired.', 400)
            )

        // 3) Upadte document in db with new password and delete the hashedResetPasswordToken and resetPasswordTokenExpireTime.
        user.password = password
        user.confirmPassword = confirmPassword
        user.hashedResetPasswordToken = undefined
        user.resetPasswordTokenExpireTime = undefined

        await user.save()
        // 4) Add changedPasswordAt field to the document.
        // (Handled with document middleware in user model)

        // 5) Log in user
        sendToken(user._id!, res)
    }
)

export const updatePassword = catchAsync(
    async (
        req: Request & Partial<{ currentUser: TUser }>,
        res: Response,
        next: NextFunction
    ) => {
        const { oldPassword, newPassword, confirmNewPassword } = req.body
        // 0) Check if there is an old password and a new password.
        if (!oldPassword || !newPassword || !confirmNewPassword)
            return next(new AppError('Please provide valid passwords.', 400))

        // 1) Check if the passwords are the same
        if (oldPassword === newPassword)
            return next(new AppError('Please provide a new password.', 400))

        if (!req.currentUser) return next()
        const user = req.currentUser as any

        // 3) Check if the old password match with the passowrd in db.
        const doesMatch = await user.comparePasswords(
            oldPassword,
            user.password
        )

        if (!doesMatch)
            return next(new AppError('Old password is not correct.', 400))

        // 4) Change the password,
        user.password = newPassword
        user.confirmPassword = confirmNewPassword

        await user.save()

        // 5) Update passwordChangedAt field.
        // (Handled by document middleware function.)

        // 6) Create a new JWT and send it back to the client.
        sendToken(user._id, res)
    }
)

export const updateProfile = catchAsync(
    async (
        req: Request & Partial<{ currentUser: TUser }>,
        res: Response,
        next: NextFunction
    ) => {
        // 1) If there is a password, return with error.
        if (
            req.body.password ||
            req.body.confirmPassword ||
            req.body.newPassword ||
            req.body.role
        )
            return next(
                new AppError(
                    'You can only change name, email and your photo with this end-point',
                    400
                )
            )

        // 2) Update the document.
        if (!req.currentUser) return

        const updateValues = {
            email: req.body.email ?? req.currentUser.email,
            photo: req.body.photo ?? req.currentUser.photo,
            name: req.body.name ?? req.currentUser.name,
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.currentUser._id,
            updateValues,
            {
                new: true,
                runValidators: true,
            }
        )

        res.status(200).json({
            status: 'success',
            user: updatedUser,
        })
    }
)

export const deleteMe = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (
        req: Request & Partial<{ currentUser: TUser }>,
        res: Response,
        _: NextFunction
    ) => {
        // 1) Set active field to false.
        await UserModel.findByIdAndUpdate(req.currentUser?._id, {
            active: false,
        })
        res.status(204).json({
            status: 'success',
            message: 'User got deleted.',
        })
    }
)
