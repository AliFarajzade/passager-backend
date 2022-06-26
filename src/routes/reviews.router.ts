import { Router } from 'express'
import { protectRoute, restrictTo } from '../controllers/auth.controller'
import * as reviewsController from '../controllers/reviews.controller'

const router = Router({ mergeParams: true })

router
    .route('/')
    .get(reviewsController.getAllReviews)
    .post(
        protectRoute,
        restrictTo('user'),
        reviewsController.includeReviewFields,
        reviewsController.createNewReview
    )

// TODO: Authorization with protectroute and ...
router
    .route('/:id')
    .get(reviewsController.getReviewById)
    .delete(
        protectRoute,
        restrictTo('user', 'admin'),
        reviewsController.deleteReview
    )
    .patch(
        protectRoute,
        restrictTo('user', 'admin'),
        reviewsController.updateReview
    )

export default router
