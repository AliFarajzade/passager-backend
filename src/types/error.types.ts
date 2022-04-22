export interface IExpressError extends Error {
    statusCode: number
    status: string
    isOperational: boolean
}
