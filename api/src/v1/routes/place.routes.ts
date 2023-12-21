import { Router } from 'express';

import {
  getPlaces,
  registerPlace,
  deletePlace
} from '../../controllers/place.controller.js';

const placeRouter = Router();

placeRouter.get('/places', getPlaces).post('/places', registerPlace).delete('/places/:id', deletePlace);

export default placeRouter;