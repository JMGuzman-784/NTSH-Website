// server.js (Express backend)
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'public/uploads/' });

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.post('/upload', upload.array('images'), (req, res) => {
  const uploadedPaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ uploaded: uploadedPaths });
});
