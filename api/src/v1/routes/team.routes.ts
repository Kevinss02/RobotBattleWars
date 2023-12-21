import { Router } from 'express';

import {
  deleteTeam,
  getTeams,
  registerTeam,
  updateTeam
} from '../../controllers/team.controller.js';

const teamRouter = Router();

teamRouter.get('/teams', getTeams).post('/teams', registerTeam).delete('/teams/:id', deleteTeam).put('/teams/:id', updateTeam);
  

export default teamRouter;
