// src/index.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import listRoutes from './routes/list';
import authRoutes from './routes/auth'; // Import auth routes

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'your_mongo_uri';

app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to My List API!');
});

app.use('/api/list', listRoutes);
app.use('/api/auth', authRoutes); // Use auth routes

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
