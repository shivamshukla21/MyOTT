import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import listRoutes from './routes/list';
import NodeCache from 'node-cache';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const fs = require('fs');

type Favorite = {
  itemId: string;
  itemType: string;
};

type User = {
  userId: string;
  favorites: Favorite[];
};

let users: User[] = [];

// Load the users data from MOCK_DATA.json file
fs.readFile('./MOCK_DATA.json', 'utf8', (err: Error, data: any) => {
  if (err) {
    console.error('Error reading data file:', err.message);
    return;
  }
  users = JSON.parse(data);
  console.log('Data loaded successfully:'); // Log the loaded data
});

console.log('__dirname:', __dirname);


// Decide whether to use the PORT and MONGO_URI from HEAD or origin/main
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://shivamshukla21:8wvEUr69ekesBih@clustermyott.zfnj6um.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyOTT';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.route('/api/users/:userId')
  .get((req, res) => {
    const id = String(req.params.userId);
    const user = users.find((user : any) => user.userId === id);
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ error: 'User not found' });
  }
})
  .put((req, res) => {
    const { userId } = req.params;
    const newUserId = req.body['userId'];
    const newFavorite = {
      itemId: req.body['favorites[itemId]'],
      itemType: req.body['favorites[itemType]'],
    };
    if(!userId){
      return
    }
    // Find the user by userId
    const userIndex = users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure favorites is an array before checking
    if (!Array.isArray(users[userIndex].favorites)) {
      users[userIndex].favorites = [];
    }

    // Check if the itemId already exists in the favorites array
    const itemExists = users[userIndex].favorites.some(
      (favorite) => favorite.itemId === newFavorite.itemId
    );

    if (itemExists) {
      return res.status(409).json({ error: 'Favorite item already exists' });
    }

    // Append the new favorite item to the array
    users[userIndex].favorites.push(newFavorite);

    // Check if the newUserId already exists
    const existingUserIndex = users.findIndex((user) => user.userId === newUserId);
    if (existingUserIndex === -1 || existingUserIndex === userIndex) {
      if (newUserId) {
        users[userIndex].userId = newUserId;
      }
    }

    // Write the updated users array back to the MOCK_DATA.json file
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), 
          (err: Error) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update user favorites' });
      }
      return res.json({ message: 'User favorites updated successfully', user: users[userIndex] });
    });
})
.delete((req, res) => {
    const { userId } = req.params; 
    // Assuming userId is passed as a URL parameter

    // Find the index of the user with the given userId
    const userIndex = users.findIndex((user: { userId: string }) => 
    user.userId === userId);

    if (userIndex === -1) {
      // If the user is not found, return a 404 error
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove the user from the array
    users.splice(userIndex, 1);
  
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err: Error) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    // Return a success response
    return res.json({ message: 'User deleted successfully' });
  });
});

app.post('/api/users', (req, res) => {
    const { userId, favorites } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if userId already exists
    const existingUserIndex = users.findIndex((user) => user.userId === userId);
    if (existingUserIndex !== -1) {
      return res.status(409).json({ error: 'User with this userId already exists' });
    }

    // Create new user object
    const newUser = {
      userId,
      favorites: Array.isArray(favorites) ? favorites.map((favorite) => ({
        itemId: favorite.itemId,
        itemType: favorite.itemType,
      })) : []
    };

    // Add new user to users array
    users.push(newUser);

    // Write the updated users array back to the MOCK_DATA.json file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err: Error) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      // Return a success response
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    });
})

app.delete('/api/users/:userId/favorites/:itemId', (req, res) => {
  const { userId, itemId } = req.params;

  // Find the index of the user with the given userId
  const userIndex = users.findIndex((user) => user.userId === userId);

  if (userIndex === -1) {
    // If the user is not found, return a 404 error
    return res.status(404).json({ error: 'User not found' });
  }

  // Ensure favorites is an array before proceeding
  if (!Array.isArray(users[userIndex].favorites)) {
    return res.status(404).json({ error: 'Favorites list not found for user' });
  }

  // Find the index of the favorite item with the given itemId
  const favoriteIndex = users[userIndex].favorites.findIndex(
    (favorite) => favorite.itemId === itemId
  );

  if (favoriteIndex === -1) {
    // If the favorite item is not found, return a 404 error
    return res.status(404).json({ error: 'Favorite item not found' });
  }

  // Remove the favorite item from the array
  users[userIndex].favorites.splice(favoriteIndex, 1);

  // Write the updated users array back to the MOCK_DATA.json file
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err: Error) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete favorite item' });
    }
    return res.json({ message: 'Favorite item deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
