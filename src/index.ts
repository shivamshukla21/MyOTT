import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import listRoutes from './routes/list';
import bodyParser from 'body-parser';

require("dotenv").config();
console.log(process.env.PORT);

const app = express();
let apicache = require('apicache');
let cache = apicache.middleware;

// Decide whether to use the PORT and MONGO_URI from HEAD or origin/main
const PORT = process.env.PORT;
const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

const favSchema = new mongoose.Schema({
  itemId: String,
  itemType: String
});
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
    unique: true
  },
  favorites: [favSchema]
},
  {collection: 'MyOTT', 
   timestamps: true, 
   toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
  }}
});

const User = mongoose.model('User', userSchema);

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

app.get('/api/users', cache('5 minutes'), async (req: Request, res: Response) => {
  const allDbUsers = await User.find({});
  try {
    res.json(allDbUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.route('/api/users/:userId')
  .get(cache('5 minutes'), async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  })
  .put(async (req, res) => {
    const { userId } = req.params;
    const newFavorite = {
      itemId: req.body['favorites[itemId]'],
      itemType: req.body['favorites[itemType]'],
    };

    try {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const itemExists = user.favorites.some(
        (favorite: any) => favorite.itemId === newFavorite.itemId
      );

      if (itemExists) {
        return res.status(409).json({ error: 'Favorite item already exists' });
      }

      user.favorites.push(newFavorite);
      await user.save();

      res.json({ message: 'User favorites updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user favorites' });
    }
  })
  .patch(async (req, res) => {
    const id = String(req.params.userId);
    const updatedUserId = req.body.newUserId;

    try {
      const user = await User.findOneAndUpdate(
        { userId: id },
        { userId: updatedUserId },
        { new: true }
      );

      if (user) {
        res.json({ message: 'User ID updated successfully', user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user ID' });
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findOneAndDelete({ userId });
      if (user) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

app.post('/api/users', async (req, res) => {
  const { userId, favorites } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this userId already exists' });
    }

    const newUser = new User({
      userId,
      favorites: Array.isArray(favorites)
        ? favorites.map((favorite) => ({
            itemId: favorite.itemId,
            itemType: favorite.itemType,
          }))
        : [],
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.delete('/api/users/:userId/favorites/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favoriteIndex = user.favorites.findIndex(
      (favorite: any) => favorite.itemId === itemId
    );

    if (favoriteIndex === -1) {
      return res.status(404).json({ error: 'Favorite item not found' });
    }

    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    res.json({ message: 'Favorite item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete favorite item' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;