/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose'
import AppError from '../utils/app-error.class'
import { catchAsync } from './error.controller'

const excludeFields = (obj: Record<string, any>, ...fileds: string[]) => {
    const filteredObj: Record<string, any> = { ...obj }

    Object.keys(obj).forEach(key => {
        if (fileds.includes(key)) delete filteredObj[key]
    })

    return filteredObj
}

export const deleteDocument = (
    Model: Model<
        any,
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>
    >
) =>
    catchAsync(async (req, res, next) => {
        const { id } = req.params

        const documentToDelete = await Model.findByIdAndRemove(id)
        if (!documentToDelete)
            return next(new AppError('No document found with this ID.', 404))

        res.status(202).json({
            status: 'deleted',
            data: {},
        })
    })

export const updateDocument = (
    Model: Model<
        any,
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>
    >,
    modelName = ''
) =>
    catchAsync(async (req, res, next) => {
        const { id } = req.params

        if (modelName === 'Review') {
            // TODO: Check if review belongs to user.
            req.body = excludeFields(req.body, 'user', 'tour')
        }

        const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })

        if (!updatedDocument)
            return next(new AppError('No document found with this ID.', 404))

        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedDocument,
            },
        })
    })
