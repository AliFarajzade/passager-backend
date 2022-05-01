import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model'
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
