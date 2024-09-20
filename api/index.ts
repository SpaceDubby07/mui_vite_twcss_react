import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Open SQLite database
// Open SQLite database (create if it doesn't exist)
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

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

// Define the structure of user data
interface User {
  name: string;
  email: string;
}

// API to write users to the database
app.post('/api/users', (req: Request, res: Response) => {
  const { name, email }: User = req.body;
  db.run(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// api to get all the users from the database
app.get('/api/users', (req: Request, res: Response) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// api to delete a user from the database, by id
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.run(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

interface UserProfile {
  user_id: number;
  bio: string;
  date_of_birth: string;
  location: string;
}

// create a users profile
app.post('/api/user_profiles', (req: Request, res: Response) => {
  const { user_id, bio, date_of_birth, location }: UserProfile =
    req.body;
  db.run(
    'INSERT INTO user_profiles (user_id, bio, date_of_birth, location) VALUES (?, ?, ?, ?)',
    [user_id, bio, date_of_birth, location],
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
app.get('/api/user_profiles', (req: Request, res: Response) => {
  db.all('SELECT * FROM user_profiles', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get a profile by id
app.get('/api/user_profiles/:id', (req: Request, res: Response) => {
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

// update a user profile
app.put('/api/user_profiles/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, date_of_birth, location } = req.body;
  db.run(
    'UPDATE user_profiles SET bio = ?, date_of_birth = ?, location = ? WHERE id = ?',
    [bio, date_of_birth, location, id],
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
app.delete(
  '/api/user_profiles/:id',
  (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM user_profiles WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'User profile deleted successfully' });
    });
  }
);

interface Post {
  user_id: number;
  title: string;
  content: string;
}

// create a post
app.post('/api/posts', (req: Request, res: Response) => {
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
app.get('/api/posts', (req: Request, res: Response) => {
  db.all('SELECT * FROM posts', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get a specific post by id
app.get('/api/posts/:id', (req: Request, res: Response) => {
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
app.get(
  '/api/posts_by_user/:user_id',
  (req: Request, res: Response) => {
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
  }
);

// update a post
app.put('/api/posts/:id', (req: Request, res: Response) => {
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
app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM posts WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  });
});

interface Comment {
  user_id: number;
  post_id: number;
  content: string;
}

// post a comment
app.post('/api/comments', (req: Request, res: Response) => {
  const { user_id, post_id, content }: Comment = req.body;
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
app.get('/api/comments', (req: Request, res: Response) => {
  db.all('SELECT * FROM comments', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// get all comments by a specific user
app.get(
  '/api/comments_by_user/:user_id',
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
app.get(
  '/api/comments_by_post/:post_id',
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
app.put('/api/comments/:id', (req: Request, res: Response) => {
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
app.delete('/api/comments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM comments WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Comment deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
