const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const upload = require('../utils/emailUtils').upload;

router.post('/send-email', upload.array('attachments'), emailController.sendEmail);

module.exports = router;
