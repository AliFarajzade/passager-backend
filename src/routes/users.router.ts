import { Router } from 'express'
import * as authControllers from '../controllers/auth.controller'
import * as usersContoller from '../controllers/users.controller'

const router = Router()

router.post('/register', authControllers.signUpUser)
router.post('/enter', authControllers.logInUser)

router.post('/forgot', authControllers.forgotPassword)
router.patch('/reset/:token', authControllers.resetPassword)
router.patch(
    '/change-password',
    authControllers.protectRoute,
    authControllers.updatePassword
)

router.patch(
    '/update',
    authControllers.protectRoute,
    authControllers.updateProfile
)

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
