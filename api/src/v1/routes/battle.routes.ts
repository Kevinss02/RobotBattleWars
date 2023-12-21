import {Router } from 'express';

import {
  getBattles,
  registerBattle,
  deleteBattle
} from '../../controllers/battle.controller.js';

const battleRouter = Router();

battleRouter.get('/battles', getBattles).post('/battles', registerBattle).delete('/battles/:id', deleteBattle);

export default battleRouter;