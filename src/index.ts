import express from 'express';
import mongoose from 'mongoose';
import listRoutes from './routes/list';

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';

// Middleware
app.use(express.json());

// Routes
app.use('/api/list', listRoutes);

// Database Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // Make sure to export the app for testing purposes
