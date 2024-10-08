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

  // select distinct matches for the user
  // m - matches,
  // u1p - user1 profile,
  // u2p - user2 profile,
  // u1iu - user1 image upload,
  // u2iu - user2 image upload,
  // u1 - user1,
  // u2 - user2
  // we also get the users name from the users table
  db.all(
    `
      SELECT DISTINCT 
        m.id, m.user1_id, m.user2_id, m.matched_at,
        CASE 
          WHEN m.user1_id = ? THEN u2p.image 
          ELSE u1p.image 
        END AS matched_user_image,
        CASE 
          WHEN m.user1_id = ? THEN u2iu.image 
          ELSE u1iu.image 
        END AS matched_user_image_upload,
        CASE
          WHEN m.user1_id = ? THEN u2.name
          ELSE u1.name
        END AS matched_user_name
      FROM matches m
      LEFT JOIN user_profiles u1p ON m.user1_id = u1p.user_id
      LEFT JOIN user_profiles u2p ON m.user2_id = u2p.user_id
      LEFT JOIN user_image_uploads u1iu ON m.user1_id = u1iu.user_id
      LEFT JOIN user_image_uploads u2iu ON m.user2_id = u2iu.user_id
      LEFT JOIN users u1 ON m.user1_id = u1.id
      LEFT JOIN users u2 ON m.user2_id = u2.id
      WHERE m.user1_id = ? OR m.user2_id = ?
    `,
    [user_id, user_id, user_id, user_id, user_id],
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
