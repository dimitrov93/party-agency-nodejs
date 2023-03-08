const express = require("express");
const multer = require("multer");
const Image = require("../models/Image");
const Birthday = require("../models/Birthday");
const Anniversary = require("../models/Anniversary");
const Baptism = require("../models/Baptism");
const Prom = require("../models/Prom");
const Wedding = require("../models/Wedding");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const schemaMap = {
  birthday: Birthday,
  anniversary: Anniversary,
  baptism: Baptism,
  prom: Prom,
  wedding: Wedding
};


router.post("/:type", upload.array("images[]", 10), async (req, res) => {
  const type = req.params.type;
  const title = req.body.title;
  const files = req.files;

  if (!title || !files) {
    return res.status(400).send("Invalid request");
  }

  try {
    const images = files.map((file) => {
      return {
        filename: file.originalname,
        contentType: file.mimetype,
        data: file.buffer,
      };
    });

    const Schema = schemaMap[type];
    if (!Schema) {
      return res.status(400).send('Invalid request');
    }

    const savedImage = await Schema.findOneAndUpdate({ title }, { $push: { images } }, { new: true, upsert: true });

    res.send(savedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
