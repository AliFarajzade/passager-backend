/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregate, model, PreMiddlewareFunction, Schema } from 'mongoose'
import slugify from 'slugify'
import { TTour } from '../types/tour.types'

const TourSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'A Tour must have a name.'],
            unique: true,
            trim: true,
            minlength: [
                7,
                'A Tour name must have more or equal than 7 characters.',
            ],
            maxlength: [
                40,
                'A Tour name must have less or equal than 40 characters.',
            ],
        },
        slug: String,
        averageRating: {
            type: Number,
            default: 0,
            min: [0.1, 'A Tour rating must be more or equal than 0.1.'],
            max: [5.0, 'A Tour rating must be less or equal than 5.0.'],
        },
        price: {
            type: Number,
            required: [true, 'A Tour must have a price.'],
        },
        discounetedPrice: {
            type: Number,
            validate: {
                validator: function (this: TTour, value: number) {
                    return this.price > value
                },
                message:
                    'Discounted price ({VALUE}) must be lower than regular price.',
            },
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            required: [true, 'A Tour must have a difficulty.'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message:
                    'Difficulty must be either "easy", "medium" or "difficult".',
            },
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
        },
        summary: {
            type: String,
            required: [true, 'A Tour must have a summary.'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        coverImage: {
            type: String,
            required: [true, 'A Tour must have a cover image.'],
        },
        secretTour: {
            type: Boolean,
            default: false,
        },
        startDates: [Date],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: [
                    'Point',
                    'Start location type cannot be set or modified.',
                ],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: [
                        'Point',
                        'Start location type cannot be set or modified.',
                    ],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Virtual populate
TourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
})

// Virtual properties
TourSchema.virtual('priceToPound').get(function (this: TTour) {
    return this.price * 0.77
})

const documentMiddlewareAddSlug: PreMiddlewareFunction = function (this, next) {
    // Adding slug
    this.slug = slugify(this.name, { lower: true })

    next()
}

const aggregateMiddlewareSorting: PreMiddlewareFunction = function (
    this: Aggregate<TTour>,
    next
) {
    this.pipeline().push({
        $sort: { numTours: -1 },
    })
    next()
}

// Document middlewares: Runs bewfore .save() and .create(); NoT WHEN UPDATE!
TourSchema.pre('save', documentMiddlewareAddSlug)

TourSchema.post('save', function (this: TTour, doc, next) {
    console.log(doc)
    next()
})

const queryMiddlewareExcludeSecretTours: PreMiddlewareFunction = function (
    this,
    next
) {
    this.find({ secretTour: { $ne: true } })

    // Populate the ref fields
    this.populate({
        path: 'guides',
    })

    next()
}

// Query middlewares
TourSchema.pre(/^find/, queryMiddlewareExcludeSecretTours)

// Aggregate middlewares
TourSchema.pre('aggregate', aggregateMiddlewareSorting)

const TourModel = model('Tour', TourSchema, 'tours')

export default TourModel
