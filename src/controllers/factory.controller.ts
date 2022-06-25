/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, PopulateOptions } from 'mongoose'
import APIFeatures from '../utils/api-handler.class'
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
            data: updatedDocument,
        })
    })

export const createDocument = (
    Model: Model<
        any,
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>
    >
) =>
    catchAsync(async (req, res, _next) => {
        const createdDocument = await Model.create(req.body)

        res.status(201).json({
            status: 'success',
            data: createdDocument,
        })
    })

export const getDocument = (
    Model: Model<
        any,
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>
    >,
    populateOptions:
        | PopulateOptions
        | (string | PopulateOptions)[]
        | undefined = undefined
) =>
    catchAsync(async (req, res, next) => {
        const { id } = req.params

        let query = Model.findById(id)
        if (populateOptions) query = query.populate(populateOptions)
        const documentToFind = await query

        if (!documentToFind)
            return next(new AppError('No document found with this ID.', 404))

        // Getting all tours from db
        res.status(200).json({
            status: 'success',
            data: documentToFind,
        })
    })

export const getAllDocuments = (
    Model: Model<
        any,
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>
    >,
    modelName = ''
) =>
    catchAsync(async (req, res, _next) => {
        let queryFilter: Record<string, string | never> = {}

        if (modelName === 'Review')
            req.params.id && (queryFilter = { tour: req.params.id })

        // Craete a query request
        const features = new APIFeatures(Model.find(queryFilter), req.query)
        features.filter().sort().fields().pagination()
        const documents = await features.query

        // Getting all tours from db
        res.status(200).json({
            status: 'success',
            results: documents.length,
            data: documents,
        })
    })
