const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const prepareAttachments = (req) => {
  const attachments = [];
  if (req.files) {
    req.files.forEach((file) => {
      attachments.push({
        filename: file.originalname,
        path: file.path,
      });
    });
  }
  return attachments;
};

module.exports = {
  upload,
  prepareAttachments,
};
