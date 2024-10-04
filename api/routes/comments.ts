import express, { Request, Response } from 'express';
import { db } from '../index';
import { Comments } from '../../types';
const router = express.Router();

// post a comment
router.post('/', (req: Request, res: Response) => {
  const { user_id, post_id, content }: Comments = req.body;
  db.run(
    'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
    [user_id, post_id, content],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// get all comments
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM comments', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get('/authorDetails', (req, res) => {
  const query = `
    SELECT comments.id, comments.user_id, comments.post_id, comments.content, comments.created_at,
      users.name as authorName, user_profiles.image as authorImage
    FROM comments
    JOIN users ON comments.user_id = users.id
    JOIN user_profiles ON users.id = user_profiles.user_id
    ORDER BY comments.created_at DESC
    `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(
        'Error fetching posts with author details:',
        err.message
      );
      res
        .status(500)
        .json({ error: 'Failed to fetch posts with author details' });
      return;
    }

    if (!rows.length) {
      console.log('No posts found with author details');
      res.status(404).json({ message: 'No posts found' });
      return;
    }

    res.json(rows);
  });
});

// get all comments by a specific user
router.get('/:user_id', (req: Request, res: Response) => {
  const { user_id } = req.params;
  db.all(
    'SELECT * FROM comments WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// get all comments for a specific post
router.get('/:post_id', (req: Request, res: Response) => {
  const { post_id } = req.params;
  db.all(
    'SELECT * FROM comments WHERE post_id = ?',
    [post_id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// update a comment
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  db.run(
    'UPDATE comments SET content = ? WHERE id = ?',
    [content, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Comment updated successfully' });
    }
  );
});

// delete a specific comment
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM comments WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Comment deleted successfully' });
  });
});

export default router;
