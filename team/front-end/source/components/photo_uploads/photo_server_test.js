const express = require('express');
const multer = require('multer');
const db = require('./database');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for easy access
});

// Upload an image
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

// Retrieve an image by ID
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

    // Set headers and send the image data
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust MIME type if necessary
    res.setHeader('Content-Disposition', `inline; filename="${row.name}"`);
    res.send(row.data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
