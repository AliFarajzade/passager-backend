/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IExpressError extends Error {
    statusCode: number
    status: string
    isOperational: boolean
    code?: number
}

export interface IMongodbError {
    index: number
    code: number
    statusCode: number
    status: string
    keyPattern: {
        name: number
    }
    keyValue: {
        name: string
    }
}

export interface IValidationError {
    errors: Record<any, any>
    statusCode: number
    _message: string
    status: string
    name: string
    message: string
}

export interface IJSONWebTokenError {
    name: string
    message: string
    expiredAt?: string
    statusCode: number
    status: string
}
