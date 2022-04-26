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
