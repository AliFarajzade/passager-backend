import type { Request, Response, NextFunction } from 'express'
export type TControllerCRUDFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>
