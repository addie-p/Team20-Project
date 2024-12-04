const sqlite3 = require('sqlite3').verbose();

// sqlite database initialization
const db = new sqlite3.Database('./images.db', (err) => {
  if (err) { // check for errors when opening db
    console.error('Error opening database:', err.message);
  } else { // create or connect to db
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant TEXT NOT NULL,
        data BLOB NOT NULL
      )
    `, (err) => {
      if (err) { 
        console.error('Error creating table:', err.message);
      } else {
        console.log('Images table ready.');
      }
    });
  }
});

module.exports = db;
