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

// get all comments by a specific user
router.get(
  '/:user_id',
  (req: Request, res: Response) => {
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
  }
);

// get all comments for a specific post
router.get(
  '/:post_id',
  (req: Request, res: Response) => {
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
  }
);

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
