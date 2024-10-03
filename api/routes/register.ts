import express, { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { db } from '../index';
import { User } from '../../types';
import jwt from 'jsonwebtoken';
const router = express.Router();

const AUTH_SECRET = process.env.AUTH_SECRET || 'secret';

const generateVerificationToken = (email: string) => {
  const verificationToken = jwt.sign({ email }, AUTH_SECRET, {
    expiresIn: '1h',
  });
  return verificationToken;
};

// register a user
router.post('/', (req: Request, res: Response) => {
  const { name, email, password }: User = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please fill in all fields' });
    return;
  }

  // check if the email already exists
  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (row) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
    }
  );

  // Hash the password with the generated salt
  const hashedPassword = bcrypt.hashSync(password, 10);

  // generate jwt token
  const token = generateVerificationToken(email);

  // calculate the expiration date and time
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // insert the user into the users table
  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // get the ID of the newly inserted user
      const userId = this.lastID;

      // insert the verification token into the verification_tokens table
      db.run(
        'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          res.json({
            id: userId,
            name,
            email,
            verification_token: token,
          });
        }
      );
    }
  );
});

export default router;
