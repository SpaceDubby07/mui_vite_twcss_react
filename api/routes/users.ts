import express, { Request, Response } from 'express';
import { db } from '../index';

const router = express.Router();

// api to get all the users from the database
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(row);
  });
});

// update the user
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.run(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Your delete route
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  // Ensure foreign key support is enabled
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('Error enabling foreign key support:', err);
      return res
        .status(500)
        .json({ error: 'Failed to enable foreign key support' });
    }

    // Start a transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res
          .status(500)
          .json({ error: 'Failed to start transaction' });
      }

      // Delete the user (this should cascade to user_profiles, posts, and comments)
      db.run(
        'DELETE FROM users WHERE id = ?',
        [userId],
        function (err) {
          if (err) {
            console.error('Error deleting user:', err);
            db.run('ROLLBACK');
            return res
              .status(500)
              .json({ error: 'Failed to delete user' });
          }

          const deletedUserCount = this.changes;

          // Commit the transaction
          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              db.run('ROLLBACK');
              return res
                .status(500)
                .json({ error: 'Failed to commit transaction' });
            }

            // Check if any user was actually deleted
            if (deletedUserCount === 0) {
              return res
                .status(404)
                .json({ message: 'User not found' });
            }

            // If the delete was successful
            res.json({
              message:
                'User and associated data deleted successfully',
            });
          });
        }
      );
    });
  });
});

export default router;
