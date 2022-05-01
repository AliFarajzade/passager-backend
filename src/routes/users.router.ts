import { Router } from 'express'
import * as authControllers from '../controllers/auth.controller'

const router = Router()

router.post('/register', authControllers.signUpUser)
router.post('/enter', authControllers.logInUser)

// prettier-ignore
router
    .route('/')

// prettier-ignore
router
    .route('/:id')

export default router
