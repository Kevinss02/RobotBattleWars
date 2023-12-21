import {Router } from 'express';

import {
    getBattleKinds,
    registerBattleKind,
    deleteBattleKind,
} from '../../controllers/battlekind.controller.js';

const battlekindRouter = Router();

battlekindRouter.get('/battlekind', getBattleKinds).post('/battlekind', registerBattleKind).delete('/battlekind/:id', deleteBattleKind);

export default battlekindRouter;