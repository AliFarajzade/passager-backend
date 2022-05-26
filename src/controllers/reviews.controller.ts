import type { NextFunction, Request, Response } from 'express'
import ReviewModel from '../models/review.model'
import { TUser } from '../types/user.types'
import { catchAsync } from './error.controller'
import {
    createDocument,
    deleteDocument,
    getDocument,
    updateDocument,
} from './factory.controller'

export const getAllReviews = catchAsync(async (req, res, _next) => {
    let filter: Record<string, string> = {}

    if (req.params.id) filter = { tour: req.params.id }

    console.log(filter)

    // 1) Get all review from database.
    const reviews = await ReviewModel.find(filter)

    // 2) Send review back to the clinet.
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    })
})

export const includeReviewFields = (
    req: Request & Partial<{ currentUser: TUser }>,
    _res: Response,
    next: NextFunction
) => {
    if (!req.body.tour) req.body.tour = req.params.id
    req.body.user = req.currentUser?._id
    next()
}

export const createNewReview = createDocument(ReviewModel)

export const deleteReview = deleteDocument(ReviewModel)

export const updateReview = updateDocument(ReviewModel, 'Review')

export const getTourById = getDocument(ReviewModel)
