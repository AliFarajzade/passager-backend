import { RequestHandler, Request, Response } from 'express'
import TourModel from '../models/tour.model'

// Get all tours
export const getAllTours: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        // Filtering
        let queryObj = { ...req.query }
        const filterFields = ['sort', 'limit', 'page', 'fields']
        filterFields.forEach(field => delete queryObj[field])

        // Complex Filtering
        const queryStr = JSON.stringify(queryObj)
        queryObj = JSON.parse(
            queryStr.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`)
        )

        console.log(queryObj)
        console.log(queryStr)

        const tours = await TourModel.find(queryObj)

        // Getting all tours from db
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        })
    }
}

// Get tour by ID
export const getTourByID: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        })
    }
}

// Update (patch) tour by ID
export const patchTourByID: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        })
    }
}

// Delete tour by ID

// Update (patch) tour by ID
export const deleteTourByID: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params

        await TourModel.findByIdAndRemove(id)

        res.status(202).json({
            status: 'deleted',
            data: {},
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        })
    }
}

// Create new tour
export const createNewTour: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const createdTour = await TourModel.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                tour: createdTour,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        })
    }
}
