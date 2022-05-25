/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, PreMiddlewareFunction, Schema } from 'mongoose'
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
            ref: 'User',
        },
        tour: {
            type: Schema.Types.ObjectId,
            required: [true, 'A review must relate to a tour.'],
            ref: 'Tour',
        },
    },
    // Add createdAt and updatedAt fields.
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const queryMiddlewarePopulateFields: PreMiddlewareFunction = function (
    this,
    next
) {
    // For populating the ref fields.

    this.populate({
        path: 'user',
        select: 'name photo',
    })

    next()
}

// Query middleware
ReviewSchema.pre(/^find/, queryMiddlewarePopulateFields)

const ReviewModel = model('Review', ReviewSchema, 'reviews')

export default ReviewModel
