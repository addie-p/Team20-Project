const sqlite3 = require('sqlite3').verbose();

// sqlite database initialization
const db = new sqlite3.Database('./images.db', (err) => {
  if (err) { // check for errors when opening db
    console.error('Error opening database:', err.message);
  } else { // create or connect to db
    console.log('Connected to the SQLite database.');
    //make the table w/ correct schema if it does not already exist
    db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        restaurant_name TEXT NOT NULL,
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

 //if resetting structure of database, use the following before create table call
 
//  db.run(`DROP TABLE IF EXISTS images`, (err) => {
//     if (err) {
//       console.error('Error dropping table:', err.message);
//     } else {
//       console.log('Old images table dropped.');
//     }
//   });
