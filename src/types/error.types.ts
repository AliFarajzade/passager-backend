export type TExpressError = Error & {
    statusCode?: number
    status?: string
}
