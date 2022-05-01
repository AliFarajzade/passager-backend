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
