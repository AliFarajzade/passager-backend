import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorMiddleware } from './controllers/error.controller'
import toursRouter from './routes/tours.router'
import usersRouter from './routes/users.router'
import AppError from './utils/app-error.class'
import { customRateLimiter } from './utils/limiter.helper'

const app = express()

process.env.NODE_ENV === 'production' && app.use(helmet())
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

app.use(express.json())

// Routers middlewares
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)

// Unknown route error
app.all('*', (req: Request, _: Response, next: NextFunction) =>
    next(new AppError(`No routes specified at ${req.originalUrl}`, 404))
)

app.use(errorMiddleware)

export default app
