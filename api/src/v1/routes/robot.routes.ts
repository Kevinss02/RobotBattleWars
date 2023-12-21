import { Router} from 'express';

import { deleteRobot, getRobots, registerRobot, updateRobot } from '../../controllers/robot.controller.js';

const robotRouter = Router();

robotRouter.get('/robots', getRobots).post('/robots', registerRobot).put('/robots/:id', updateRobot).delete('/robots/:id', deleteRobot);


export default robotRouter;
