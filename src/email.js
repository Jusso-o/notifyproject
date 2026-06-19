const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, text }) {
  await sgMail.send({
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text,
  });
}

module.exports = { sendEmail };