import { RequestHandler, Request, Response } from 'express'

// Get all tours
export const getAllTours: RequestHandler = async (
    _: Request,
    res: Response
) => {
    try {
        // Getting all tours from db

        res.status(200).json({
            status: 'success',
            data: {},
        })

        // No content found
        res.status(204).json({
            status: 'success',
            data: {},
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'No tours found.',
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

        // Getting all tours from db
        res.status(200).json({
            status: 'success',
            data: {},
        })

        // No content found
        res.status(204).json({
            status: 'success',
            data: {},
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'No tours found.',
        })
    }
}

// Update (patch) tour by ID
export const patchTourByID: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        // Get tours ID
        const { id } = req.params
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'No tours found.',
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
        // Get tours ID
        const { id } = req.params
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'No tours found.',
        })
    }
}

// Create new tour
export const createNewTour: RequestHandler = async (
    req: Request,
    res: Response
) => {
    try {
        // Get tours ID
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'No tours found.',
        })
    }
}
