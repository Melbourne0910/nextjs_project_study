import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "src/data/app.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    text TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

const { count: userCount } = db.prepare("SELECT COUNT(*) as count FROM users").get();

if (userCount === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");

  const seedUsers = db.transaction((users) => {
    users.forEach((user) => {
      insertUser.run(user.name, user.email);
    });
  });

  seedUsers([
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
  ]);
}

export default db;
