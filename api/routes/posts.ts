import express, { Request, Response } from 'express';
import { Post } from '../../types';
import { db } from '../index';
const router = express.Router();

// create a post
router.post('/', (req: Request, res: Response) => {
  const { user_id, title, content }: Post = req.body;
  db.run(
    'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
    [user_id, title, content],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// get all posts
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get a specific post by id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(row);
  });
});

// get all posts by a specific user
router.get('/:user_id', (req: Request, res: Response) => {
  const { user_id } = req.params;
  db.get(
    'SELECT * FROM posts WHERE user_id = ?',
    [user_id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json(row);
    }
  );
});

// update a post
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.run(
    'UPDATE posts SET title = ?, content = ? WHERE id = ?',
    [title, content, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Post updated successfully' });
    }
  );
});

// delete a post
// TODO: Delete post, and all comments associated with it
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Delete from comments table
    db.run('DELETE FROM comments WHERE post_id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        db.run('ROLLBACK');
        return;
      }

      // Optionally delete from other tables as needed (e.g., posts, comments)
      // db.run('DELETE FROM posts WHERE user_id = ?', [id], (err) => { ... });

      // Finally, delete the user from the users table
      db.run('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.run('ROLLBACK'); // Rollback transaction if there's an error
          return;
        }

        // Commit the transaction if all queries succeed
        db.run('COMMIT', (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({
            message: 'Post and associated data deleted successfully',
          });
        });
      });
    });
  });
});

export default router;
