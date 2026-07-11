import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { courses } from "@/data/courses";
import { shuffledMessages } from "@/data/messages";
import { users } from "@/data/users";

const dbPath = path.join(process.cwd(), "src/data/app.db");
const loadSQL = (relativePath) => {
  return fs.readFileSync(
    path.join(process.cwd(), "src/data/db", relativePath),
    "utf8"
  );
};

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

// const dropTablesSQL = loadSQL("schema/drop-tables.sql");
const createTablesSQL = loadSQL("schema/create-tables.sql");
const createMessagesTableSQL = loadSQL("schema/table.sql");
const insertMessagesSQL = loadSQL("seed/insert_messages.sql");
const insertUserSQL = loadSQL("seed/insert-users.sql");

// db.exec(dropTablesSQL);
db.exec(createTablesSQL);

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

const { count: userCount } = db
  .prepare("SELECT COUNT(*) as count FROM users")
  .get();

if (userCount === 0) {
  const insertUser = db.prepare(insertUserSQL);

  const seedUsers = db.transaction((userList) => {
    for (const user of userList) {
      const hashedPassword = bcrypt.hashSync(user.password, 10);

      insertUser.run(
        user.name,
        user.email,
        hashedPassword,
        user.email_verified,
        user.verification_token,
        user.is_admin,
        user.password_reset_token,
        user.password_reset_expires
      );
    }
  });

  seedUsers(users);

  console.log("Users seeded successfully");
}

const messageColumns = new Set(
  db.prepare("PRAGMA table_info(messages)")
    .all()
    .map((column) => column.name)
);

if (messageColumns.has("userId")) {
  const defaultCourse = db
    .prepare("SELECT id FROM courses ORDER BY id ASC LIMIT 1")
    .get();

  if (!defaultCourse) {
    throw new Error("A course is required to migrate existing messages");
  }

  const migrateMessages = db.transaction(() => {
    db.exec("ALTER TABLE messages RENAME TO messages_legacy");
    db.exec(createMessagesTableSQL);
    db.prepare(`
      INSERT INTO messages (
        id,
        user_id,
        course_id,
        text,
        created_at
      )
      SELECT
        id,
        userId,
        ?,
        text,
        createdAt
      FROM messages_legacy
    `).run(defaultCourse.id);
    db.exec("DROP TABLE messages_legacy");
  });

  migrateMessages();
  console.log("Messages table migrated successfully");
}

const { count: messageCount } = db
  .prepare("SELECT COUNT(*) as count FROM messages")
  .get();

if (messageCount === 0) {
  const insertMessage = db.prepare(insertMessagesSQL);

  const seedMessages = db.transaction((messageList) => {
    for (const message of messageList) {
      insertMessage.run(
        message.user_id,
        message.course_id,
        message.text
      );
    }
  });

  seedMessages(shuffledMessages);
  console.log("Messages seeded successfully");
}

export default db;
