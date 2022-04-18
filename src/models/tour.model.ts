import { Schema, model, Query, Aggregate } from 'mongoose'
import { TTour } from '../types/tour.types'
import slugify from 'slugify'

const TourSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'A Tour must have a name.'],
        },
        slug: String,
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
        secretTour: {
            type: Boolean,
            defaultValue: false,
        },
        startDates: [Date],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Virtual properties
TourSchema.virtual('priceToPound').get(function (this: TTour) {
    return this.price * 0.77
})

// Document middlewares
TourSchema.pre('save', function (this: TTour, next) {
    console.log('Adding slug...')
    this.slug = slugify(this.name, { lower: true })
    next()
})

TourSchema.post('save', function (this: TTour, doc, next) {
    console.log('Document Saved.')
    console.log(doc)
    next()
})

// Query middlewares
TourSchema.pre(
    /^find/,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (this: Query<any[], any, Record<string, any>, any>, next) {
        this.find({ secretTour: { $ne: true } })
        next()
    }
)

TourSchema.post(
    /^find/,
    function (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this: Query<any[], any, Record<string, any>, any>,
        docs: TTour[],
        next
    ) {
        this.find({ secretTour: { $ne: true } })
        console.log(docs)
        next()
    }
)

// Aggregate middlewares
TourSchema.pre('aggregate', function (this: Aggregate<TTour>, next) {
    this.pipeline().push({
        $sort: { numTours: -1 },
    })
    next()
})

const TourModel = model('tours', TourSchema)

export default TourModel
