/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Query, Schema } from 'mongoose'
import { TReview } from '../types/review.types'
const ReviewSchema = new Schema(
    {
        review: {
            type: String,
            minlength: 3,
            maxlength: 200,
            required: [true, 'Review cannot be empty!'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'A review must have a rating.'],
        },
        user: {
            type: Schema.Types.ObjectId,
            required: [true, 'A review must have an author.'],
            ref: 'users',
        },
        tour: {
            type: Schema.Types.ObjectId,
            required: [true, 'A review must relate to a tour.'],
            ref: 'tours',
        },
    },
    // Add createdAt and updatedAt fields.
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Query middleware
ReviewSchema.pre(
    /^find/,
    function (this: TReview & Query<any, any, any, any>, next) {
        // For populating the ref fields.

        this.populate({
            path: 'user',
            select: 'name photo',
        }).populate({
            path: 'tour',
            select: 'name slug -guides',
        })

        next()
    }
)

// 628b666b6e60221121e1b810

const ReviewModel = model('reviews', ReviewSchema)

export default ReviewModel
