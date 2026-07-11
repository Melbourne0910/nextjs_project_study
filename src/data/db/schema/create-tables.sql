CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  is_admin INTEGER DEFAULT 0,
  password_reset_token TEXT,
  password_reset_expires TEXT
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  course_slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  original_price TEXT,
  current_price TEXT,
  rating TEXT,
  reviews TEXT,
  level TEXT,
  duration TEXT,
  lessons TEXT,
  instructor TEXT,
  is_paid BOOLEAN DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  edited_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
