import { NextFunction, Request, Response } from 'express'
import ReviewModel from '../models/review.model'
import { TUser } from '../types/user.types'
import { catchAsync } from './error.controller'

export const getAllReviews = catchAsync(
    async (_req: Request, res: Response, _: NextFunction) => {
        // 1) Get all review from database.
        const reviews = await ReviewModel.find()

        // 2) Send review back to the clinet.
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews,
            },
        })
    }
)

export const createNewReview = catchAsync(
    async (
        req: Request & Partial<{ currentUser: TUser }>,
        res: Response,
        _: NextFunction
    ) => {
        // 1)  Create new tour in database.
        const newReview = await ReviewModel.create({
            ...req.body,
            user: req.currentUser?._id,
        })

        // 2) Send the new review back to the clinet.
        res.status(200).json({
            status: 'success',
            data: {
                review: newReview,
            },
        })
    }
)
