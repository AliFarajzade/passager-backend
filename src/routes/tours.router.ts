import { Router } from 'express'
import { protectRoute, restrictTo } from '../controllers/auth.controller'
import * as toursController from '../controllers/tours.controller'
import reviewRouter from './reviews.router'

const router = Router()

router
    .route('/')
    .get(toursController.getAllTours)
    .post(
        protectRoute,
        restrictTo('admin', 'lead-guide'),
        toursController.createNewTour
    )

router.route('/get-stats').get(toursController.getTourStatsPipeline)

router
    .route('/top-5-cheap')
    .get(toursController.aliesTopTours, toursController.getAllTours)

router
    .route('/:id')
    .all(protectRoute, restrictTo('admin'))
    .get(toursController.getTourByID)
    .patch(toursController.patchTourByID)
    .delete(toursController.deleteTourByID)

router.use('/:id/reviews', reviewRouter)

export default router
