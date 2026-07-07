import Database from "better-sqlite3";
import path from "path";
import { courses } from "@/data/courses";

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
`);

const courseCount = db
  .prepare("SELECT COUNT(*) as count FROM courses")
  .get()
  .count;

if (courseCount === 0) {
  const insertCourse = db.prepare(`
    INSERT OR IGNORE INTO courses (
      title,
      course_slug,
      subtitle,
      description,
      image,
      original_price,
      current_price,
      rating,
      reviews,
      level,
      duration,
      lessons,
      instructor,
      is_paid,
      is_bestseller
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((courses) => {
    for (const course of courses) {
      insertCourse.run(
        course.title,
        course.course_slug,
        course.subtitle,
        course.description,
        course.image,
        course.original_price,
        course.current_price,
        course.rating,
        course.reviews,
        course.level,
        course.duration,
        course.lessons,
        course.instructor,
        course.is_paid ? 1 : 0,
        course.is_bestseller ? 1 : 0
      );
    }
  });

  insertMany(courses);

  console.log("Courses seeded successfully");
}

// const { count: userCount } = db.prepare("SELECT COUNT(*) as count FROM users").get();
//
// if (userCount === 0) {
//   const insertUser = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
//
//   const seedUsers = db.transaction((users) => {
//     users.forEach((user) => {
//       insertUser.run(user.name, user.email);
//     });
//   });
//
//   seedUsers([
//     { name: "Alice", email: "alice@example.com" },
//     { name: "Bob", email: "bob@example.com" },
//     { name: "Charlie", email: "charlie@example.com" },
//   ]);
// }

export default db;
