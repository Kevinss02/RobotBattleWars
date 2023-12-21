import { Response, Router } from 'express';

import {
  deleteMember,
  getMembers,
  registerMember,
  updateMember,
} from '../../controllers/member.controller.js';
import { authRequired } from '../../middlewares/validateToken.middleware.js';
import { RequestWithUser } from '../../utils/types/types.js';

const memberRouter = Router();

memberRouter.get(
  '/members',
  authRequired,
  (req: RequestWithUser, res: Response) => {
    void getMembers(req, res);
  },
);

memberRouter
  .post('/members', registerMember)
  .delete('/members/:id', authRequired, deleteMember)
  .put('/members/:id', authRequired, updateMember);

export default memberRouter;
