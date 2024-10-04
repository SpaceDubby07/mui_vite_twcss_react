import express, { Request, Response } from 'express';
import { UserProfile } from '../../types';
import { db } from '../index';
const router = express.Router();

// create a users profile
router.post('/', (req: Request, res: Response) => {
  const {
    user_id,
    bio,
    date_of_birth,
    location,
    image,
  }: UserProfile = req.body;
  db.run(
    'INSERT INTO user_profiles (user_id, bio, date_of_birth, location, image) VALUES (?, ?, ?, ?, ?)',
    [user_id, bio, date_of_birth, location, image],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// get all users profiles
router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM user_profiles', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get the user profile by profile id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get(
    'SELECT * FROM user_profiles WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    }
  );
});

// get a user profile by user id
router.get('/user/:user_id', (req: Request, res: Response) => {
  const { user_id } = req.params;
  db.get(
    'SELECT * FROM user_profiles WHERE user_id = ?',
    [user_id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    }
  );
});

// update a user profile
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, date_of_birth, location, image } = req.body;
  db.run(
    'UPDATE user_profiles SET bio = ?, date_of_birth = ?, location = ?, image = ? WHERE id = ?',
    [bio, date_of_birth, location, image, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User profile updated successfully' });
    }
  );
});

router.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, date_of_birth, location, image } = req.body;
  db.run(
    'UPDATE user_profiles SET bio = ?, date_of_birth = ?, location = ?, image = ? WHERE id = ?',
    [bio, date_of_birth, location, image, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User profile updated successfully' });
    }
  );
});

// delete a users profile
router.delete(':id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM user_profiles WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User profile deleted successfully' });
  });
});

export default router;
