import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';

import memberRouter from './v1/routes/member.routes.js';
import teamRouter from './v1/routes/team.routes.js';
import battleRouter from './v1/routes/battle.routes.js';
import robotRouter from './v1/routes/robot.routes.js';
import placeRouter from './v1/routes/place.routes.js';
import battlekindRouter from './v1/routes/battlekind.routes.js';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', memberRouter, teamRouter, battleRouter, robotRouter, placeRouter, battlekindRouter);

app.all('*', (_, res) => {
  console.log('Not implemented');
  res.status(501).json({ code: 501, message: 'Not implemented' });
});

export default app;
