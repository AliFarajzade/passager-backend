import { model, Schema } from 'mongoose'

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

const ReviewModel = model('reviews', ReviewSchema)

export default ReviewModel
