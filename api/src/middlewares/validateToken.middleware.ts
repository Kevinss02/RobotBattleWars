import { type NextFunction, type Response } from 'express';
import jwt from 'jsonwebtoken';

import { TOKEN_SECRET } from '../config.js';

export const authRequired = function (
  req: any,
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers.token;

  if (token == null) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (err: any, user: any) => {
    if (err != null) {
      console.error('Token validation error:', err);
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = user;
    console.log(user);

    next();
  });
};
