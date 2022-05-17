import type { NextFunction, Request, Response } from 'express'
import { TUser } from './user.types'
export type TControllerCRUDFunction = (
    req: Request & Partial<{ currentUser: TUser }>,
    res: Response,
    next: NextFunction
) => Promise<void>
