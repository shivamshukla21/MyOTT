import express, { Request, Response } from 'express';
import List from '../models/list';

const router = express.Router();

// Add a favorite TV show or movie to My List
router.post('/add-favorite', async (req: Request, res: Response) => {
  const { userId, itemId, itemType } = req.body;
  try {
    // Add item to user's list as a favorite
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
    // Remove item from user's list of favorites
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

// List favorite TV shows and movies
router.get('/favorites/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Retrieve user's list of favorite items
    const list = await List.findOne({ userId });
    res.status(200).json(list?.favorites);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

export default router;