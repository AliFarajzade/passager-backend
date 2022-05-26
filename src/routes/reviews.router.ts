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
    .all(protectRoute)
    .get(reviewsController.getTourById)
    .delete(protectRoute, reviewsController.deleteReview)
    .patch(protectRoute, reviewsController.updateReview)

export default router
