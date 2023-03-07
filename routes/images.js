const express = require('express');
const Image = require('../models/Image');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const images = await Image.find();
    if (!images || images.length === 0) {
      return res.status(404).json({ error: 'No images found' });
    }

    const imagesWithMetadata = images.map((image) => {
      return {
        title: image.title,
        images: image.images.map((img) => {
          return {
            filename: img.filename,
            data: img.data.toString('base64'),
            contentType: img.contentType
          }
        })
      };
    });

    res.json(imagesWithMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
