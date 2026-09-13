const { createClient } = require('@libsql/client');
const db = createClient ({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
});

async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username  TEXT UNIQUE NOT NULL,
        password  TEXT NOT NULL
    )
 `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS procedures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL 
    )
 `);
  await db.execute(` 
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        min_quantity INTEGER NOT NULL,
        unit TEXT NOT NULL
    )
 `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS procedure_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        procedure_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        FOREIGN KEY (procedure_id) REFERENCES procedures(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
 `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS finances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        procedure_id INTEGER NOT NULL,
        FOREIGN KEY (procedure_id) REFERENCES procedures(id)
  )
`);
}

module.exports = { db, initDB };