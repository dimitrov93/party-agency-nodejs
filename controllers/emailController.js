const nodemailer = require('nodemailer');
const emailUtils = require('../utils/emailUtils');

const dotenv = require('dotenv');
dotenv.config();

const sendEmail = (req, res) => {
  const { name, email, message } = req.body;
  const attachments = emailUtils.prepareAttachments(req);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    sender: 'gmail',
    auth: {
      user: `stefanytomova@gmail.com`,
      pass: `qowpmlpwdjhpvevj`,
    },
  });

  const mailOptions = {
    from: email,
    replyTo: email,
    to: `stefanytomova@gmail.com`,
    subject: 'New message from your website',
    text: `${name} (${email}) has sent you a message:\n\n${message}`,
    attachments: attachments,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error: ' + err);
      return res.status(500).send(err);
    }
    console.log(`Email sent: ${info.response}`);
    res.send('Email sent successfully!');
  });
};

module.exports = {
  sendEmail,
};
