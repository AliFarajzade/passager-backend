import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import toursRouter from './routes/tours.router'
import usersRouter from './routes/users.router'
import { TExpressError } from './types/error.types'

const app = express()

// Genral middlewares
app.use(express.json())
process.env.NODE_ENV === 'development' && app.use(morgan('dev'))

// Routers middlewares
app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', usersRouter)

// Unknown route error
app.all('*', (req: Request, _: Response, next: NextFunction) => {
    const err = new Error(
        `No routes specified at ${req.originalUrl}`
    ) as TExpressError
    err.status = 'fail'
    err.statusCode = 404
    next(err)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: TExpressError, _: Request, res: Response, __: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
})

export default app
