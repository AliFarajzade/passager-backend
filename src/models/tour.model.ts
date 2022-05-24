/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aggregate, model, Query, Schema } from 'mongoose'
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
            ref: 'users',
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

// Document middlewares: Runs bewfore .save() and .create(); NoT WHEN UPDATE!
TourSchema.pre(
    'save',
    function (this: TTour & Query<any, any, any, any>, next) {
        // Adding slug
        this.slug = slugify(this.name, { lower: true })

        next()
    }
)

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

        // Populate the ref fields
        this.populate({
            path: 'guides',
        })

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
