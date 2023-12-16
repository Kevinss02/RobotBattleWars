import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';

const app: Express = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.all('*', (_, res) => {
  console.log('Not implemented');
  res.status(501).send();
});

export default app;
