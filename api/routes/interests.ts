import express, { Request, Response } from 'express';
import { db } from '../index';
const router = express.Router();

// get all interests from the interests table
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM interests', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get a users interests
router.get('/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;

  db.all(
    'SELECT * FROM user_interests WHERE user_id = ?',
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // If rows is empty, send an empty array
      res.json(rows || []); // Always return an array
    }
  );
});

// update a users interests with userId and interestId from the interests and users table
router.post('/add', (req: Request, res: Response) => {
  const { user_id, interest_id } = req.body;
  // Check if the interest is already added
  db.get(
    'SELECT * FROM user_interests WHERE user_id = ? AND interest_id = ?',
    [user_id, interest_id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (row) {
        res.status(400).json({ error: 'Interest already added' });
        return;
      }

      // Insert or replace entry
      db.run(
        'INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)',
        [user_id, interest_id],
        (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({
            message: 'Interest updated or inserted successfully',
          });
        }
      );
    }
  );
});

// Delete a user_interest from the user_interests table
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM user_interests WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Interest deleted successfully' });
  });
});

export default router;
