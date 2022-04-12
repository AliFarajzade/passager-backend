import { Schema, model } from 'mongoose'

const TourSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A Tour must have a name.'],
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A Tour must have a price.'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    difficulty: {
        type: String,
        required: [true, 'A Tour must have a difficulty.'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A Tour must have a group size.'],
    },
    duration: {
        type: Number,
        required: [true, 'A Tour must have a duration.'],
    },
    images: {
        type: [String],
        required: [true, 'A Tour must contain at least 3 images.'],
    },
    summary: {
        type: String,
        required: [true, 'A Tour must have a summary.'],
    },
    description: {
        type: String,
        required: [true, 'A Tour must have a description.'],
    },
    coverImage: {
        type: String,
        required: [true, 'A Tour must have a cover image.'],
    },

    startDates: {
        type: [Date],
        required: [true, 'A Tour must have a start date.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

const TourModel = model('tours', TourSchema)

export default TourModel
