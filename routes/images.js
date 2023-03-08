const express = require('express');
const Image = require('../models/Image');
const Birthday = require("../models/Birthday");
const Anniversary = require("../models/Anniversary");
const Baptism = require("../models/Baptism");
const Prom = require("../models/Prom");
const Wedding = require("../models/Wedding");
const router = express.Router();


const schemaMap = {
  birthday: Birthday,
  anniversary: Anniversary,
  baptism: Baptism,
  prom: Prom,
  wedding: Wedding
};

router.get('/:type', async (req, res) => {
  const type = req.params.type; 

  const Schema = schemaMap[type];

  try {
    const images = await Schema.find();
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
