import { IExpressError } from '../types/error.types'

class AppError extends Error implements IExpressError {
    public status: string
    public isOperational: boolean
    public statusCode: number
    constructor(message: string, statusCode: number) {
        super(message)

        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError
