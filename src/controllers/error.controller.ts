import { NextFunction, Request, Response } from 'express'
import { TControllerCRUDFunction } from '../types/controllers.types'
import { IExpressError } from '../types/error.types'

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

    if (process.env.NODE_ENV === 'development') {
        handleErrorDev(res, err)
    } else if (process.env.NODE_ENV === 'production') {
        handleErrorProd(res, err)
    }
}

// Get rid of trycatch block
export const catchAsync =
    (fn: TControllerCRUDFunction) =>
    (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
