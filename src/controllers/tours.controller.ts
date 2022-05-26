import type { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../controllers/error.controller'
import TourModel from '../models/tour.model'
import APIFeatures from '../utils/api-handler.class'
import {
    createDocument,
    deleteDocument,
    getDocument,
    updateDocument,
} from './factory.controller'

// Get all tours
export const getAllTours = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        // Craete a query request
        const features = new APIFeatures(TourModel.find(), req.query)
        features.filter().sort().fields().pagination()
        const tours = await features.query

        // Getting all tours from db
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        })
    }
)

// Get tour by ID
export const getTourByID = getDocument(TourModel, {
    path: 'reviews',
    options: { limit: '10', sort: '-createdAt' },
})

// Update (patch) tour by ID
export const patchTourByID = updateDocument(TourModel)

// Delete tour by ID
export const deleteTourByID = deleteDocument(TourModel)
// Create new tour
export const createNewTour = createDocument(TourModel)

export const getTourStatsPipeline = catchAsync(async (_req, res, _next) => {
    const stats = await TourModel.aggregate([
        {
            $group: {
                _id: '$difficulty',
                numTours: { $sum: 1 },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' },
            },
        },
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    })
})

// Add query for top 5 tours
export const aliesTopTours = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        req.query.limit = '5'
        req.query.sort = '-averageRating,price'
        req.query.fields = 'name,averageRating,price,difficulty'
        next()
    } catch (error) {
        console.log(error)
    }
}
