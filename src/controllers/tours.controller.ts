import type { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../controllers/error.controller'
import TourModel from '../models/tour.model'
import APIFeatures from '../utils/api-handler.class'
import AppError from '../utils/app-error.class'

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
export const getTourByID = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // Get tours ID
        const { id } = req.params

        const tourToFind = await TourModel.findById(id).populate({
            path: 'reviews',
            options: { limit: '10', sort: '-createdAt' },
        })

        if (!tourToFind)
            return next(new AppError('No tour found with this ID.', 404))

        // Getting all tours from db
        res.status(200).json({
            status: 'success',
            data: {
                tour: tourToFind,
            },
        })
    }
)

// Update (patch) tour by ID
export const patchTourByID = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const updatedTour = await TourModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedTour)
        return next(new AppError('No tour found with this ID.', 404))

    res.status(200).json({
        status: 'success',
        data: {
            tour: updatedTour,
        },
    })
})

// Delete tour by ID
export const deleteTourByID = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const tourToDelete = await TourModel.findByIdAndRemove(id)

    if (!tourToDelete)
        return next(new AppError('No tour found with this ID.', 404))

    res.status(202).json({
        status: 'deleted',
        data: {},
    })
})
// Create new tour
export const createNewTour = catchAsync(async (req, res, _next) => {
    const createdTour = await TourModel.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tour: createdTour,
        },
    })
})

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
