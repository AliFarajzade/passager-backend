import type { NextFunction, Request, Response } from 'express'
import { catchAsync } from '../controllers/error.controller'
import TourModel from '../models/tour.model'
import AppError from '../utils/app-error.class'
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument,
} from './factory.controller'

// Get all tours
export const getAllTours = getAllDocuments(TourModel)

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

export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params

    const [lat, lng] = JSON.parse(latlng)
    if (!lat || !lng || !distance || !unit)
        return next(
            new AppError(
                'Please provide a latitude, longitude, unit and distance.',
                400
            )
        )

    const radian =
        unit === 'km' ? parseInt(distance) / 6371 : parseInt(distance) / 3958

    const tours = await TourModel.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radian] } },
    })

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    })
})

export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params

    const [lat, lng] = JSON.parse(latlng) as [number, number]

    if (!lat || !lng || !unit)
        return next(
            new AppError('Please provide a latitude, longitude and unit.', 400)
        )

    const multiplier = unit === 'km' ? 0.001 : 0.000621371

    const tours = await TourModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ])

    res.status(200).json({
        status: 'success',
        data: {
            data: tours,
        },
    })
})

export const getTourBySlug = catchAsync(async (req, res, next) => {
    const { slug } = req.params

    const tourToFind = await TourModel.findOne({ slug }).populate('guides')

    res.status(200).json({
        status: 'success',
        data: tourToFind,
    })
})
