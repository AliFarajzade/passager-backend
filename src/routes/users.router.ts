import { Router } from 'express'
import * as authControllers from '../controllers/auth.controller'
import * as usersContoller from '../controllers/users.controller'

const router = Router()

router.post('/register', authControllers.signUpUser)
router.post('/enter', authControllers.logInUser)

router
    .route('/')
    .get(
        authControllers.protectRoute,
        authControllers.restrictTo('admin', 'lead-guide'),
        usersContoller.getAllUsers
    )

// prettier-ignore
router
    .route('/:id')

export default router
