import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/user.model'
import { TUser } from '../types/user.types'
import {
    deleteDocument,
    getAllDocuments,
    getDocument,
} from './factory.controller'

export const getAllUsers = getAllDocuments(UserModel)

export const getUserById = getDocument(UserModel)

export const deleteUser = deleteDocument(UserModel)

export const getMe = (
    req: Request & Partial<{ currentUser: TUser }>,
    _res: Response,
    next: NextFunction
) => req.currentUser && (req.params.id = req.currentUser._id) && next()
