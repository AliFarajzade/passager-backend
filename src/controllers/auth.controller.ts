import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import UserModel from '../models/user.model'
import { TJWTDecodedType } from '../types/user.types'
import AppError from '../utils/app-error.class'
import { catchAsync } from './error.controller'

const generateToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE_TIME as string,
    })

export const signUpUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        }

        const newUser = await UserModel.create(data)

        const token = generateToken(newUser._id)

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser,
            },
        })
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
        const token = generateToken(user._id)
        res.status(200).json({
            status: 'success',
            token,
        })
    }
)

export const protectRoute = catchAsync(
    async (req: Request, _: Response, next: NextFunction) => {
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
        const user = await UserModel.findById(id)
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

        next()
    }
)

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyODIwOTBkMGU4YTRhMDBjZjg3ZTMwNiIsImlhdCI6MTY1MjY4OTE2NiwiZXhwIjoxNjU1MjgxMTY2fQ.ekt_zx1qJUWwu3OLuCEoO8ijYanTl6pT-bAPY6E-VNE
