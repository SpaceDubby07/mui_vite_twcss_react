import express, { Request, Response } from 'express';
import { db } from '../index';
const router = express.Router();

// get all matches
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM matches', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get a specific match
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM matches WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }
    res.json(row);
  });
});

// get all matches for a specific user
router.get('/user/:user_id', (req: Request, res: Response) => {
  const { user_id } = req.params;
  db.all(
    'SELECT * FROM matches WHERE user1_id = ? OR user2_id = ?',
    [user_id, user_id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

export default router;
