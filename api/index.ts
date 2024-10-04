import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import userProfilesRouter from './routes/userProfiles';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import followsRouter from './routes/follows';
import matchesRouter from './routes/matches';
import registerRouter from './routes/register';
import loginRouter from './routes/login';
import tokenRouter from './routes/token';
import uploadsRouter from './routes/uploads';

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/user_profiles', userProfilesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/follows', followsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/token', tokenRouter);
app.use('/api/uploads', uploadsRouter);

// Open SQLite database
// Open SQLite database (create if it doesn't exist)
export const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Enable foreign key support globally
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Error enabling foreign key support:', err);
      } else {
        console.log('Foreign key support enabled.');
      }
    });

    // Create tables if they don't exist
    const createTables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS user_image_uploads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        bio TEXT,
        date_of_birth DATE,
        location TEXT,
        image TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        post_id INTEGER,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS comments_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        comment_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS posts_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        post_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS follows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        follower_id INTEGER,
        followed_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(follower_id, followed_id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_follower_id ON follows(follower_id)`,
      `CREATE INDEX IF NOT EXISTS idx_followed_id ON follows(followed_id)`,
      `CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user1_id INTEGER,
        user2_id INTEGER,
        matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user1_id, user2_id),
        CHECK(user1_id <> user2_id)
      )`,
      `CREATE INDEX IF NOT EXISTS idx_user1_id ON matches(user1_id)`,
      `CREATE INDEX IF NOT EXISTS idx_user2_id ON matches(user2_id)`,
      `CREATE TABLE IF NOT EXISTS verification_tokens (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );`,
    ];

    // Execute each CREATE TABLE statement
    db.serialize(() => {
      createTables.forEach((tableQuery, index) => {
        db.run(tableQuery, (err) => {
          if (err) {
            console.error(
              `Error creating table ${index + 1}:`,
              err.message
            );
          } else {
            console.log(
              `Table ${index + 1} exists or has been created.`
            );
          }
        });
      });
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
