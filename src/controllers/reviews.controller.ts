import ReviewModel from '../models/review.model'
import { catchAsync } from './error.controller'
import { deleteDocument } from './factory.controller'

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

export const createNewReview = catchAsync(async (req, res, _next) => {
    if (!req.body.tour) req.body.tour = req.params.id

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
})

export const deleteReview = deleteDocument(ReviewModel)








