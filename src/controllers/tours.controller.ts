import type { RequestHandler, Request, Response, NextFunction } from 'express'
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

        let query = TourModel.find(queryObj)

        // Sorting
        let { sort: sortStr } = req.query
        if (sortStr) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sortStr = sortStr.replace(/(,)/g, ' ')
            query = query.sort(sortStr)
        }

        // Fields
        let { fields: fieldsStr } = req.query
        if (fieldsStr) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fieldsStr = fieldsStr.replace(/(,)/g, ' ')
            query = query.select(fieldsStr)
        } else {
            query = query.select('-__v')
        }

        // Pagination
        const { page, limit } = req.query

        const pageNumber = page ? +page : 1
        const limitValue = limit ? +limit : 5

        query = query.skip((pageNumber - 1) * limitValue).limit(limitValue)

        const tours = await query

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
