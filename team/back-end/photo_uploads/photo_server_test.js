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

  const { originalname, buffer } = req.file; // image file field 
  const { restaurant_name } = req.body; // restaurant name text field

  // check if restaurant name is found
  if (!restaurant_name) {
    return res.status(400).send('Restaurant name is required.');
  }

  const sql = `INSERT INTO images (name, data, restaurant_name) VALUES (?, ?, ?)`;
  db.run(sql, [originalname, buffer, restaurant_name], function (err) {
    if (err) {
      console.error('Error inserting image:', err.message);
      return res.status(500).send('Failed to upload image.');
    }
    res.status(201).send({ id: this.lastID, name: originalname, restaurant_name });
  });
});

// retrieve an image by id (number in database)
app.get('/image2/:id', (req, res) => {
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

// retrieve an image by file name
app.get('/image/:name', (req, res) => {
    const { name } = req.params;
    console.log("test2")
  
    const sql = `SELECT name, data FROM images WHERE name = ?`;
    db.get(sql, [name], (err, row) => {
      if (err) {
        console.error('Error retrieving image:', err.message);
        return res.status(500).send('Failed to retrieve image.');
      }
  
      if (!row) {
        return res.status(404).send('Image not found.');
      }
  
      res.setHeader('Content-Type', 'image/jpeg'); // adjust MIME type if necessary
      res.setHeader('Content-Disposition', `inline; filename="${row.name}"`);
      res.send(row.data);
    });
});

// retrieve an image by restaurant name
app.get('/image3/:restaurant_name', (req, res) => {
  const { restaurant_name } = req.params;

  const sql = `SELECT name, data FROM images WHERE restaurant_name = ?`;
  db.get(sql, [restaurant_name], (err, row) => {
    if (err) {
      console.error('Error retrieving image:', err.message);
      return res.status(500).send('Failed to retrieve image.');
    }

    if (!row) {
      return res.status(404).send('No image found for the specified restaurant.');
    }

    // Set appropriate content headers for the image
    res.setHeader('Content-Disposition', `inline; filename="${row.name}"`);
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on the image format
    res.send(row.data); // Send the binary image data
  });
});


// start server to start listening to calls
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
