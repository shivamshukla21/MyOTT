import express, { Request, Response } from 'express';
import List from '../models/list';

const router = express.Router();

// Add a favorite TV show or movie to My List
router.post('/add-favorite', async (req: Request, res: Response) => {
  const { userId, itemId, itemType } = req.body;
  try {
    const list = await List.findOneAndUpdate(
      { userId },
      { $addToSet: { favorites: { itemId, itemType } } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Item added to favorites successfully', list });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

// Remove a favorite TV show or movie from My List
router.delete('/remove-favorite', async (req: Request, res: Response) => {
  const { userId, itemId } = req.body;
  try {
    const list = await List.findOneAndUpdate(
      { userId },
      { $pull: { favorites: { itemId } } },
      { new: true }
    );
    res.status(200).json({ message: 'Item removed from favorites successfully', list });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

// List favorite TV shows and movies with pagination
router.get('/favorites/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  try {
    // Retrieve user's list of favorite items
    const list = await List.findOne({ userId });
    if (!list) {
      return res.status(404).json({ error: 'User list not found' });
    }
    const favorites = list.favorites;
    const paginatedFavorites = favorites.slice((page - 1) * limit, page * limit);
    res.status(200).json({ favorites: paginatedFavorites }); // Ensure to return an object with 'favorites' property
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

export default router;