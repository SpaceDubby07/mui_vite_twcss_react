import express, { Request, Response } from 'express';
import { Follow } from '../../types';
import { db } from '../index';
const router = express.Router();

interface FollowCount {
  count: number; // Represents the count of mutual follows
}

// validate follows
const validateFollow = (
  follower_id: number,
  followed_id: number
): boolean => {
  if (!follower_id || !followed_id || follower_id === followed_id) {
    return false;
  }
  return true;
};

// get all follows
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM follows', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// create a follow
router.post('/', (req: Request, res: Response) => {
  const { follower_id, followed_id }: Follow = req.body;

  // Validate the follow instance
  if (!validateFollow(follower_id, followed_id)) {
    return res.status(400).json({ error: 'Invalid follow' });
  }

  // Insert the follow into the database
  db.run(
    'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)',
    [follower_id, followed_id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Check if the followed user follows the follower back
      db.get<FollowCount>(
        'SELECT COUNT(*) as count FROM follows WHERE follower_id = ? AND followed_id = ?',
        [followed_id, follower_id],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // If both follow each other, create a match
          if (row.count > 0) {
            db.run(
              'INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)',
              [follower_id, followed_id],
              (err) => {
                if (err) {
                  console.error(
                    'Failed to create match:',
                    err.message
                  );
                }
              }
            );
          }

          // Return the ID of the newly created follow
          res.json({ id: this.lastID });
        }
      );
    }
  );
});

// delete a follow
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get<Follow>(
    'SELECT follower_id, followed_id FROM follows WHERE id = ?',
    [id],
    (err, follow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!follow) {
        res.status(404).json({ error: 'Follow not found' });
        return;
      }

      const { follower_id, followed_id } = follow;

      // Delete the follow record
      db.run('DELETE FROM follows WHERE id = ?', [id], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Now delete the match if it exists
        db.run(
          'DELETE FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
          [follower_id, followed_id, followed_id, follower_id],
          (err) => {
            if (err) {
              console.error('Failed to delete match:', err.message);
            }
          }
        );

        res.json({
          message:
            'Follow and corresponding match deleted successfully',
        });
      });
    }
  );
});

// get a specific follow
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM follows WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Follow not found' });
      return;
    }
    res.json(row);
  });
});

// update a follow
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { follower_id, followed_id } = req.body;
  db.run(
    'UPDATE follows SET follower_id = ?, followed_id = ? WHERE id = ?',
    [follower_id, followed_id, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Follow updated successfully' });
    }
  );
});

// check if users are matched
router.get(
  '/check/:follower_id/:followed_id',
  (req: Request, res: Response) => {
    const { follower_id, followed_id } = req.params;
    db.get(
      'SELECT * FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [follower_id, followed_id, followed_id, follower_id],
      (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (!row) {
          res.status(404).json({ error: 'No match found' });
          return;
        }
        res.json({
          message: 'Match Found',
          data: row,
        });
      }
    );
  }
);

export default router;
