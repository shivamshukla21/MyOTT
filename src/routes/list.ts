import { Router, Request, Response } from 'express';
import List from '../models/list';

const router = Router();

// Add to My List
router.post('/add', async (req: Request, res: Response) => {
  const { userId, itemId, itemType } = req.body;
  try {
    const list = await List.findOneAndUpdate(
      { userId },
      { $addToSet: { items: { itemId, itemType } } },
      { new: true, upsert: true }
    );
    res.status(200).json(list);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

// Remove from My List
router.post('/remove', async (req: Request, res: Response) => {
  const { userId, itemId } = req.body;
  try {
    const list = await List.findOneAndUpdate(
      { userId },
      { $pull: { items: { itemId } } },
      { new: true }
    );
    res.status(200).json(list);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

// List My Items
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const list = await List.findOne({ userId });
    res.status(200).json(list);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

export default router;
