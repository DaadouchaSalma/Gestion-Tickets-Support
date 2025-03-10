const nodemailer = require('nodemailer');
require('dotenv').config();

// Config transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send status update par email
const sendStatusUpdateEmail = (recipient, ticketTitle, newStatus) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: `Statut du ticket mis à jour: ${ticketTitle}`,
    text: `\n\nBonjour,\n\nLe statut de votre ticket "${ticketTitle}" a été mis à jour à "${newStatus}".\n\nVérifiez votre compte.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = { sendStatusUpdateEmail };
