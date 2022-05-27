import type { NextFunction, Request, Response } from 'express'
import ReviewModel from '../models/review.model'
import { TUser } from '../types/user.types'
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from './factory.controller'

export const getAllReviews = getAllDocuments(ReviewModel, 'Review')

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

export const getReviewById = getDocument(ReviewModel)
