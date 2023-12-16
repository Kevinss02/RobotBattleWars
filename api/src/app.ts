import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.all('*', (_, res) => {
  console.log('Not implemented');
  res.status(501).json({ code: 501, message: 'Not implemented' });
});

export default app;
