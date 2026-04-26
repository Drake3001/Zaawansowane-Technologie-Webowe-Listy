import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

let db;

export async function getDb() {
  if (db) return db;

  // Open database connection
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      login TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Check if we need to seed
  const count = await db.get('SELECT COUNT(*) as count FROM users');
  if (count.count === 0) {
    console.log('Database empty, seeding from JSONPlaceholder...');
    await seedDatabase();
  } else {
    console.log('Database already has data. Skipping seed.');
  }

  return db;
}

async function seedDatabase() {
  try {
    const usersRes = await axios.get("https://jsonplaceholder.typicode.com/users");
    const todosRes = await axios.get("https://jsonplaceholder.typicode.com/todos");

    // Insert users
    const stmtUsers = await db.prepare('INSERT INTO users (id, name, email, login) VALUES (?, ?, ?, ?)');
    for (const u of usersRes.data) {
      await stmtUsers.run(u.id, u.name, u.email, u.username);
    }
    await stmtUsers.finalize();

    // Insert todos
    const stmtTodos = await db.prepare('INSERT INTO todos (id, title, completed, user_id) VALUES (?, ?, ?, ?)');
    for (const t of todosRes.data) {
      await stmtTodos.run(t.id, t.title, t.completed ? 1 : 0, t.userId);
    }
    await stmtTodos.finalize();

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
