import { NextFunction, Request, Response } from 'express'
import type { CastError } from 'mongoose'
import { TControllerCRUDFunction } from '../types/controllers.types'
import {
    IExpressError,
    IJSONWebTokenError,
    IMongodbError,
    IValidationError,
} from '../types/error.types'
import AppError from '../utils/app-error.class'

const handleCastError = (err: CastError) =>
    new AppError(`Invalid ${err.path}: ${err.value}`, 400)

const handleDuplicateKeyError = (err: IMongodbError) =>
    new AppError(`Duplicate field error ${JSON.stringify(err.keyValue)}`, 400)

const handleValidationError = (err: IValidationError) => {
    const messages = Object.entries(err.errors)
        .map(arr => arr[1].message)
        .join(' ')
    return new AppError(`Validation Error: ${messages}`, 400)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleExpiredTokenError = (_: IJSONWebTokenError) =>
    new AppError('Token has been expired.', 401)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleInvlidSignaturError = (_: IJSONWebTokenError) =>
    new AppError('Invalid signature.', 401)

const handleErrorDev = (res: Response, err: IExpressError) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    })
}

const handleErrorProd = (res: Response, err: IExpressError) => {
    if (err.isOperational)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    else {
        console.log('🧨️ Error: \n', err)
        res.status(500).json({
            status: 'fail',
            message: 'Something went very wrong!',
        })
    }
}

export const errorMiddleware = (
    err: IExpressError,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __: NextFunction
) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'production') {
        handleErrorDev(res, err)
    } else if (process.env.NODE_ENV === 'development') {
        // Handling Cast erroes
        if (err.name === 'CastError') {
            const newError = handleCastError(err as unknown as CastError)
            return handleErrorProd(res, newError)
        }

        // Handling duplicate field error
        if (err.code === 11000) {
            const newError = handleDuplicateKeyError(
                err as unknown as IMongodbError
            )
            return handleErrorProd(res, newError)
        }

        // Handling fields validation error
        if (err.name === 'ValidationError') {
            const newError = handleValidationError(
                err as unknown as IValidationError
            )
            return handleErrorProd(res, newError)
        }

        if (err.name === 'TokenExpiredError') {
            const newError = handleExpiredTokenError(
                err as unknown as IJSONWebTokenError
            )
            return handleErrorProd(res, newError)
        }

        if (err.name === 'JsonWebTokenError') {
            const newError = handleInvlidSignaturError(err)
            return handleErrorProd(res, newError)
        }

        // Handling general errors
        handleErrorProd(res, err)
    }
}

// Get rid of trycatch block
export const catchAsync =
    (fn: TControllerCRUDFunction) =>
    (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
