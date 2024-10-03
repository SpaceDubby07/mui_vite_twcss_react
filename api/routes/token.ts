import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

interface DecodedToken {
  id: number; // Change this to the appropriate type if `id` is not a number
  // Add any other properties that are included in your token payload
}

// Ensure you're using middleware to parse cookies (like cookie-parser)
router.get('/', (req: Request, res: Response) => {
  // Get token from cookie
  const token = req.cookies.token as string;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Unauthorized: No token provided' });
  }

  // Verify token
  jwt.verify(
    token,
    process.env.AUTH_SECRET || 'secret',
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ error: 'Unauthorized: Invalid token' });
      }

      // Cast decoded to DecodedToken
      const user = decoded as DecodedToken;

      // Successful token verification
      return res.json({ id: user.id });
    }
  );
});

export default router;
