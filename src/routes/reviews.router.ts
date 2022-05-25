import { Router } from 'express'
import { protectRoute, restrictTo } from '../controllers/auth.controller'
import * as reviewsController from '../controllers/reviews.controller'

const router = Router({ mergeParams: true })

router
    .route('/')
    .get(reviewsController.getAllReviews)
    .post(protectRoute, restrictTo('user'), reviewsController.createNewReview)

router.route('/:id').delete(reviewsController.deleteReview)
export default router
