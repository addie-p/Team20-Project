const express = require('express');
const multer = require('multer');
const db = require('./photo_db_test'); //match to db calls
const fs = require('fs');

const app = express();
const port = 3000;

// configure multer for file uploads for image post and get
const upload = multer({
  storage: multer.memoryStorage(), // store file in memory for easy access
});

// upload an image with post method to endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { originalname, buffer } = req.file;

  const sql = `INSERT INTO images (name, data) VALUES (?, ?)`;
  db.run(sql, [originalname, buffer], function (err) {
    if (err) {
      console.error('Error inserting image:', err.message);
      return res.status(500).send('Failed to upload image.');
    }
    res.status(201).send({ id: this.lastID, name: originalname });
  });
});

// retrieve an image by id (number in database)
app.get('/image/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT name, data FROM images WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error retrieving image:', err.message);
      return res.status(500).send('Failed to retrieve image.');
    }
    if (!row) {
      return res.status(404).send('Image not found.');
    }

    // set headers and image data
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="${row.name}"`);
    res.send(row.data);
  });
});

// start server to start listening to calls
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
