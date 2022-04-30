import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/user.model'
import { catchAsync } from './error.controller'

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

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        })
    }
)
