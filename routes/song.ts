import express, { Request, Response } from 'express';
import Song from '../model/song.js';

const router = express.Router();

// Validation middleware
const validateSongInput = (
  req: Request,
  res: Response,
  next: express.NextFunction
): void => {
  const { name, artist, title } = req.body;

  if (!name || !artist || !title) {
    res.status(400).json({
      error: 'Validation failed',
      message: 'Name, artist, and title are required fields',
    });
    return;
  }

  if (
    typeof name !== 'string' ||
    typeof artist !== 'string' ||
    typeof title !== 'string'
  ) {
    res.status(400).json({
      error: 'Validation failed',
      message: 'Name, artist, and title must be strings',
    });
    return;
  }

  next();
};

// POST - Suggest a song
router.post(
  '/',
  validateSongInput,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, artist, title, link, message } = req.body;

      // Check for duplicate songs
      const existingSong = await Song.findOne({
        artist: { $regex: new RegExp(`^${artist}$`, 'i') },
        title: { $regex: new RegExp(`^${title}$`, 'i') },
      });

      if (existingSong) {
        res.status(409).json({
          error: 'Duplicate song',
          message: 'This song has already been suggested',
        });
        return;
      }

      const song = new Song({ name, artist, title, link, message });
      await song.save();

      res.status(201).json({
        message: 'Song suggestion submitted successfully',
        song: {
          id: song._id,
          name: song.name,
          artist: song.artist,
          title: song.title,
          status: song.status,
          createdAt: song.createdAt,
        },
      });
    } catch (error: any) {
      console.error('Error creating song:', error);

      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        res.status(400).json({
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to save song suggestion',
        message: 'An internal server error occurred',
      });
    }
  }
);

// GET - Get all songs with optional filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status = 'approved',
      page = '1',
      limit = '10',
      artist,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build filter object
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (artist) {
      filter.artist = { $regex: artist as string, $options: 'i' };
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortObj: any = {};
    sortObj[sort as string] = order === 'asc' ? 1 : -1;

    const songs = await Song.find({})
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Song.countDocuments(filter);

    res.json({
      songs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      error: 'Failed to fetch songs',
      message: 'An internal server error occurred',
    });
  }
});

// GET - Get song by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        error: 'Invalid ID format',
        message: 'Song ID must be a valid MongoDB ObjectId',
      });
      return;
    }

    const song = await Song.findById(id).select('-__v');

    if (!song) {
      res.status(404).json({
        error: 'Song not found',
        message: 'No song found with the provided ID',
      });
      return;
    }

    res.json({ song });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({
      error: 'Failed to fetch song',
      message: 'An internal server error occurred',
    });
  }
});

// PUT - Update song status (for admin use)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, approved, rejected',
      });
      return;
    }

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        error: 'Invalid ID format',
        message: 'Song ID must be a valid MongoDB ObjectId',
      });
      return;
    }

    const song = await Song.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!song) {
      res.status(404).json({
        error: 'Song not found',
        message: 'No song found with the provided ID',
      });
      return;
    }

    res.json({
      message: 'Song status updated successfully',
      song,
    });
  } catch (error) {
    console.error('Error updating song status:', error);
    res.status(500).json({
      error: 'Failed to update song status',
      message: 'An internal server error occurred',
    });
  }
});

// DELETE - Delete a song
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        error: 'Invalid ID format',
        message: 'Song ID must be a valid MongoDB ObjectId',
      });
      return;
    }

    const song = await Song.findByIdAndDelete(id);

    if (!song) {
      res.status(404).json({
        error: 'Song not found',
        message: 'No song found with the provided ID',
      });
      return;
    }

    res.json({
      message: 'Song deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({
      error: 'Failed to delete song',
      message: 'An internal server error occurred',
    });
  }
});

export default router;
