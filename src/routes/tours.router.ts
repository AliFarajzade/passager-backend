import { Router } from 'express'
import { protectRoute, restrictTo } from '../controllers/auth.controller'
import * as toursController from '../controllers/tours.controller'
import reviewRouter from './reviews.router'

const router = Router()

router.route('/get-by-slug/:slug').get(toursController.getTourBySlug)

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(toursController.getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(toursController.getDistances)

router.route('/get-stats').get(toursController.getTourStatsPipeline)

router
    .route('/top-5-cheap')
    .get(toursController.aliesTopTours, toursController.getAllTours)

router
    .route('/')
    .get(toursController.getAllTours)
    .post(
        protectRoute,
        restrictTo('admin', 'lead-guide'),
        toursController.createNewTour
    )

router
    .route('/:id')
    .get(toursController.getTourByID)
    .patch(protectRoute, restrictTo('admin'), toursController.patchTourByID)
    .delete(protectRoute, restrictTo('admin'), toursController.deleteTourByID)

router.use('/:id/reviews', reviewRouter)

export default router
