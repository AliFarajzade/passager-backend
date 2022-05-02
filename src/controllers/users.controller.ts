import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/user.model'
import { catchAsync } from './error.controller'

export const getAllUsers = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_: Request, res: Response, __: NextFunction) => {
        const users = await UserModel.find()

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        })
    }
)
