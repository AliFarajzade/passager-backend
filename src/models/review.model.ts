/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Model,
    model,
    PostMiddlewareFunction,
    PreMiddlewareFunction,
    Schema,
} from 'mongoose'
import TourModel from './tour.model'
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

ReviewSchema.statics.calculateAverageRatingAndQuantity = async function (
    this: Model<typeof ReviewSchema>,
    tourId: string
) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ])

    console.log(stats)

    await TourModel.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        averageRating: stats[0].avgRating,
    })
}

const replaceAverageRatingAndQuantity: PostMiddlewareFunction = function (
    this,
    res,
    next
) {
    this.constructor.calculateAverageRatingAndQuantity(res.tour)
    next()
}

// Query middleware
ReviewSchema.pre(/^find/, queryMiddlewarePopulateFields)

ReviewSchema.post('save', replaceAverageRatingAndQuantity)

const ReviewModel = model('Review', ReviewSchema, 'reviews')

export default ReviewModel
