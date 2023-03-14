const express = require("express");
const Image = require("../models/Image");
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
  wedding: Wedding,
};

// get by id
router.get("/:type/:id", async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;

  const Schema = schemaMap[type];

  try {
    const image = await Schema.findById(id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imageWithMetadata = {
      _id: image._id,
      title: image.title,
      images: image.images.map((img) => {
        return {
          filename: img.filename,
          data: img.data.toString("base64"),
          contentType: img.contentType,
        };
      }),
    };

    res.json(imageWithMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// get by type
router.get("/:type", async (req, res) => {
  const type = req.params.type;

  const Schema = schemaMap[type];

  try {
    const images = await Schema.find();
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }

    const imagesWithMetadata = images.map((image) => {
      return {
        _id: image._id,
        title: image.title,
        images: image.images.map((img) => {
          return {
            filename: img.filename,
            data: img.data.toString("base64"),
            contentType: img.contentType,
          };
        }),
      };
    });

    res.json(imagesWithMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//DELETE
router.delete("/:type/:id/delete", async (req, res) => {
  const type = req.params.type;

  const Schema = schemaMap[type];
  try {
    await Schema.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// edit

router.put("/:type/:id/edit", async (req, res) => {
  const type = req.params.type;
  const Schema = schemaMap[type];

  try {
    const updatedDocument = await Schema.updateOne({_id: req.params.id}, {$set: req.body}, {new: true})

    if (!updatedDocument) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json("Product has been edited...");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
