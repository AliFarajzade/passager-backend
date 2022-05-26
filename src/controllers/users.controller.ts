import UserModel from '../models/user.model'
import {
    deleteDocument,
    getAllDocuments,
    getDocument,
} from './factory.controller'

export const getAllUsers = getAllDocuments(UserModel)

export const getUserById = getDocument(UserModel)

export const deleteUser = deleteDocument(UserModel)
