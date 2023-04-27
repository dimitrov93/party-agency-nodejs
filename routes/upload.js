const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
require('dotenv').config();
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : process.env.LOCAL_URL;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type; // main folder in images
    const album = req.body.album; // the name of the main album
    const albumName = req.body.albumName; // albums that will be created in the album
    const directoryPath = path.join(
      __dirname,
      "../uploads",
      "images",
      type,
      album,
      albumName
    );
    // create the directory if it doesn't exist
    fs.mkdirSync(directoryPath, { recursive: true });
    cb(null, directoryPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// folder by name
// router.get("/:type/:albumName/:folderName", async (req, res) => {
//   console.log('tuk');
//   const albumName = req.params.albumName;
//   const type = req.params.type;
//   const folderName = req.params.folderName;

//   const directoryPath = path.join(
//     __dirname,
//     "..",
//     "uploads",
//     "images",
//     type,
//     albumName,
//     folderName // Add the folder name to the directory path
//   );
//   const albums = [];

//   try {
//     const albumPath = path.join(directoryPath);
//     const stat = await fs.promises.lstat(albumPath);
//     let images = [];
//     if (stat.isDirectory()) {
//       const imageNames = await fs.promises.readdir(albumPath);
//       images = imageNames.map((imageName) => ({
//         url: `${apiUrl}/uploads/images/${type}/${albumName}/${folderName}/${imageName}`,
//       }));
//     }
//     const location = `${apiUrl}/uploads/images/${type}/${albumName}/${folderName}`;
//     albums.push({ folder:folderName, location, images, created: stat.birthtime });

//     res.status(200).json(albums);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Error getting album from directory" });
//   }
// });

// all folders
router.get("/:type/:albumName?", async (req, res) => {
  const albumName = req.params.albumName;
  const type = req.params.type;
  const directoryPath = albumName
    ? path.join(__dirname, "..", "uploads", "images", type, albumName)
    : path.join(__dirname, "..", "uploads", "images", type);
  const albums = [];

  try {
    const albumNames = await fs.promises.readdir(directoryPath);

    for (const album of albumNames) {
      const albumPath = path.join(directoryPath, album);
      const stat = await fs.promises.lstat(albumPath);
      let images = [];
      if (stat.isDirectory()) {
        const imageNames = await fs.promises.readdir(albumPath);

        images = imageNames.map((imageName) => ({
          url: albumName
            ? `${apiUrl}/uploads/images/${type}/${albumName}/${album}/${imageName}`
            : `${apiUrl}/uploads/images/${type}/${album}/${imageName}`,
        }));
      }
      const location = albumName
        ? `${apiUrl}/uploads/images/${type}/${albumName}/${album}`
        : `${apiUrl}/uploads/images/${album}`;

      albums.push({ folder: album, location, images, created: stat.birthtime });
    }

    // Sort albums by date of creation
    albums.sort((a, b) => b.created - a.created);

    res.status(200).json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error getting albums from directory" });
  }
});


router.post("/", upload.array("file", 20), (req, res) => {
  const files = req.files.map((file) => ({
    filename: file.filename,
    path: `${apiUrl}/uploads/images/${req.body.album}/${req.body.albumName}/${file.filename}`,
  }));
  res.send(files);
});

// delete
router.delete("/:type/:album/:albumName", (req, res) => {
  const type = req.params.type; // main folder in images
  const album = req.params.album; // the name of the main album
  const albumName = req.params.albumName; // albums that will be created in the album
  console.log(type);
  const directoryPath = path.join(
    __dirname,
    "..",
    "uploads",
    "images",
    type,
    album,
    albumName
  );

  fs.rm(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error deleting folder" });
    } else {
      console.log(`Folder ${directoryPath} deleted successfully`);
      res.status(200).send({ message: "Folder deleted successfully" });
    }
  });
});

router.put("/:type/:album/:oldAlbumName", (req, res) => {
  const type = req.params.type;
  const album = req.params.album;
  const oldAlbumName = req.params.oldAlbumName;
  const newAlbumName = req.body.newAlbumName;
  const directoryPath = path.join(__dirname, "..", "uploads", "images", type, album);
  const oldFolderPath = path.join(directoryPath, oldAlbumName);
  const newFolderPath = path.join(directoryPath, newAlbumName);

  // create new folder with the new name
  fs.mkdir(newFolderPath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error renaming folder" });
    } else {
      console.log(`Folder ${newFolderPath} created`);

      // copy all files and subdirectories from old folder to new folder
      copyFolderRecursiveSync(oldFolderPath, newFolderPath);

      // delete old folder
      fs.rm(oldFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error renaming folder" });
        } else {
          console.log(`Folder ${oldFolderPath} renamed to ${newFolderPath}`);
          res.status(200).send({ message: "Folder renamed successfully" });
        }
      });
    }
  });
});

// recursive function to copy all files and subdirectories from one folder to another
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(source).forEach(function (file) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

module.exports = router;
