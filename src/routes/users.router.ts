import { Router } from 'express'
import * as authControllers from '../controllers/auth.controller'
import * as usersContoller from '../controllers/users.controller'
import { customRateLimiter } from '../utils/limiter.helper'

const router = Router()

router.post(
    '/register',
    customRateLimiter(5, 60 * 30 * 1000, 'Try making new account later.'),
    authControllers.signUpUser
)
router.post(
    '/enter',
    customRateLimiter(7, 60 * 30 * 1000, 'Try loging in later.'),
    authControllers.logInUser
)

router.post(
    '/forgot',
    customRateLimiter(5, 60 * 30 * 1000, 'Try again later.'),
    authControllers.forgotPassword
)
router.patch(
    '/reset/:token',
    customRateLimiter(5, 60 * 30 * 1000, 'Try again later.'),
    authControllers.resetPassword
)

router.use(authControllers.protectRoute)

router.get('/me', usersContoller.getMe, usersContoller.getUserById)

router.patch(
    '/change-password',
    customRateLimiter(
        5,
        60 * 30 * 1000,
        'Try changing your password in an hour.'
    ),

    authControllers.updatePassword
)

router.patch(
    '/update',
    customRateLimiter(
        25,
        60 * 30 * 1000,
        'Try updating your profile in an hour.'
    ),

    authControllers.updateProfile
)

router.delete('/delete-me', authControllers.deleteMe)

router.use(authControllers.restrictTo('admin'))

router.route('/').get(usersContoller.getAllUsers)

router
    .route('/:id')
    .delete(usersContoller.deleteUser)
    .get(usersContoller.getUserById)

export default router
