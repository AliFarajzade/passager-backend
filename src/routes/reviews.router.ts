import { Router } from 'express'
import { protectRoute, restrictTo } from '../controllers/auth.controller'
import * as reviewsController from '../controllers/reviews.controller'

const router = Router({ mergeParams: true })

router.use(protectRoute)

router
    .route('/')
    .get(
        restrictTo('admin', 'lead-guide', 'guide'),
        reviewsController.getAllReviews
    )
    .post(
        restrictTo('user'),
        reviewsController.includeReviewFields,
        reviewsController.createNewReview
    )

// TODO: Authorization with protectroute and ...
router
    .route('/:id')
    .get(reviewsController.getReviewById)
    .delete(restrictTo('user', 'admin'), reviewsController.deleteReview)
    .patch(restrictTo('user', 'admin'), reviewsController.updateReview)

export default router
