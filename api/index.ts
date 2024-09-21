import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import usersRouter from './routes/users';
import userProfilesRouter from './routes/userProfiles';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/user_profiles', userProfilesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
