/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose'
import AppError from '../utils/app-error.class'
import { catchAsync } from './error.controller'

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
