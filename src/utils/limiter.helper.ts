import rateLimit from 'express-rate-limit'

export const customRateLimiter = (
    max: number,
    windowMs: number,
    message: string
) =>
    rateLimit({
        max, // Limit each IP to 100 requests per `window`
        windowMs, // 30 minutes
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message,
    })
