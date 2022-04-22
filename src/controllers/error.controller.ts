import { NextFunction, Request, Response } from 'express'
import { IExpressError } from '../types/error.types'

export const errorMiddleware = (
    err: IExpressError,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __: NextFunction
) => {
    console.log(err.stack)

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}
