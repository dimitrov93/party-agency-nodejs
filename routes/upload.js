const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', upload.array('images[]', 10), async (req, res) => {
  const title = req.body.title;
  const files = req.files;

  if (!title || !files) {
    return res.status(400).send('Invalid request');
  }

  try {
    const images = files.map((file) => {
      return {
        filename: file.originalname,
        contentType: file.mimetype,
        data: file.buffer
      };
    });

    const savedImage = await Image.findOneAndUpdate({ title }, { $push: { images } }, { new: true, upsert: true });

    res.send(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
