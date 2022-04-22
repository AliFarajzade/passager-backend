import type { RequestHandler, Request, Response, NextFunction } from 'express'
import APIFeatures from '../utils/api-handler.class'
import TourModel from '../models/tour.model'
import { catchAsync } from '../controllers/error.controller'

// Get all tours
export const getAllTours: RequestHandler = catchAsync(
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

// Add query for top 5 tours
export const aliesTopTours = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    try {
        // ?limit=5&sort=-averageRating,price&fields=name,averageRating,price,difficulty
        req.query.limit = '5'
        req.query.sort = '-averageRating,price'
        req.query.fields = 'name,averageRating,price,difficulty'
        next()
    } catch (error) {
        console.log(error)
    }
}

// Get tour by ID
export const getTourByID: RequestHandler = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        // Get tours ID
        const { id } = req.params

        const tourToFind = await TourModel.findById(id)

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
export const patchTourByID: RequestHandler = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        const { id } = req.params

        const updatedTour = await TourModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour,
            },
        })
    }
)

// Delete tour by ID
export const deleteTourByID: RequestHandler = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        const { id } = req.params

        await TourModel.findByIdAndRemove(id)

        res.status(202).json({
            status: 'deleted',
            data: {},
        })
    }
)
// Create new tour
export const createNewTour: RequestHandler = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, _: NextFunction) => {
        const createdTour = await TourModel.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                tour: createdTour,
            },
        })
    }
)

export const getTourStatsPipeline: RequestHandler = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_: Request, res: Response, __: NextFunction) => {
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
    }
)
