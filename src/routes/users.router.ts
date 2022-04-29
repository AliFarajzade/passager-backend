import { Router } from 'express'
import * as authControllers from '../controllers/auth.controller'

const router = Router()

router.post('/signup', authControllers.signUpUser)

// prettier-ignore
router
    .route('/')

// prettier-ignore
router
    .route('/:id')

export default router
