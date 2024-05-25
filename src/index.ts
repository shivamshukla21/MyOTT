import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import listRoutes from './routes/list';

dotenv.config();

const app = express();

const users = require("../MOCK_DATA.json");

// Decide whether to use the PORT and MONGO_URI from HEAD or origin/main
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Add the list routes
app.use('/api/list', listRoutes);

// Root route handler
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to My List API for OTT Platform!');
});

app.get('/api/users', (req: Request, res: Response) => {
  // Assuming 'users' contains the user data
  return res.json(users);
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;