import { Router } from 'express'
import * as toursController from '../controllers/tours.controller'

const router = Router()

// prettier-ignore
router
    .route('/')
    .get(toursController.getAllTours)
    .post(toursController.createNewTour)

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
