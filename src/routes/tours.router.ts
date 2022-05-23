import { Router } from 'express'
import { protectRoute, restrictTo } from '../controllers/auth.controller'
import * as toursController from '../controllers/tours.controller'

const router = Router()

// prettier-ignore
router
    .route('/')
    .get(toursController.getAllTours)
    .post(protectRoute, restrictTo('admin', 'lead-guide'), toursController.createNewTour)

// prettier-ignore
router 
    .route('/get-stats')
    .get(toursController.getTourStatsPipeline)
// prettier-ignore

router
    .route('/top-5-cheap')
    .get(toursController.aliesTopTours, toursController.getAllTours)

// prettier-ignore
router
    .route('/:id')
    .get(toursController.getTourByID)
    .patch(toursController.patchTourByID)
    .delete(toursController.deleteTourByID)

export default router
