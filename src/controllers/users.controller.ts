import UserModel from '../models/user.model'
import { catchAsync } from './error.controller'
import { deleteDocument, getDocument } from './factory.controller'

export const getAllUsers = catchAsync(async (_req, res, _next) => {
    const users = await UserModel.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    })
})

export const getUserById = getDocument(UserModel)

export const deleteUser = deleteDocument(UserModel)
