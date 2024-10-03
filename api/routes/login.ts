import express, { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { db } from '../index';
import { User } from '../../types';
import jwt from 'jsonwebtoken';

const router = express.Router();

const AUTH_SECRET = process.env.AUTH_SECRET || 'secret';

router.post('/', (req: Request, res: Response) => {
  const { email, password }: User = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Please fill in all fields' });
    return;
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, row: { password: string; id: number }) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(401).json({ error: 'Invalid email' });
        return;
      }
      const hashedPassword = row.password;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        if (!result) {
          res
            .status(401)
            .json({ error: 'Invalid password' });
          return;
        }
        const token = jwt.sign({ id: row.id }, AUTH_SECRET, {
          expiresIn: '24h',
        });
        res.json({ token });
      });
    }
  );
});

export default router;
