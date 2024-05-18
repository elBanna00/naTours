import * as express from 'express';
// @ts-ignore
import * as tourController from '../controllers/tourController.ts';

const router = express.Router();

// router.param('id', tourController.checkID);
router
  .route('/top5')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tours-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
