import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import xss from 'xss-clean'
import { errorMiddleware } from './controllers/error.controller'
import reviewRouter from './routes/reviews.router'
import toursRouter from './routes/tours.router'
import usersRouter from './routes/users.router'
import AppError from './utils/app-error.class'
import { customRateLimiter } from './utils/limiter.helper'

const app = express()

process.env.NODE_ENV === 'development' && app.use(morgan('dev'))

// Genral middlewares
app.use(
    '/api',
    customRateLimiter(
        100,
        15 * 16 * 1000,
        'Too many requests! Please try again later.'
    )
)

app.use(
    express.json({ limit: '10kb' }),
    helmet(),
    mongoSanitize(),
    xss(),
    hpp({
        whitelist: [
            'duration',
            'price',
            'difficulty',
            'averageRating',
            'ratingsQuantity',
            'maxGroupSize',
        ],
    })
)

app.use(cors())

// Routers middlewares
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/reviews', reviewRouter)

// Unknown route error
app.all('*', (req: Request, _: Response, next: NextFunction) =>
    next(new AppError(`No routes specified at ${req.originalUrl}`, 404))
)

app.use(errorMiddleware)

export default app
