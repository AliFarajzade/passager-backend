import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/user.model'
import { catchAsync } from './error.controller'

export const signUpUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        const newUser = await UserModel.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        })
    }
)
