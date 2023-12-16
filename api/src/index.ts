import 'reflect-metadata';

import app from './app.js';
import { HOST, PORT } from './config.js';
import { connectDB } from './database/db.js';

void connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${HOST}:${PORT}`);
});
