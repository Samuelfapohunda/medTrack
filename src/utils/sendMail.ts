import nodemailer from 'nodemailer';

const sendEmail = async (options: {
  email: any;
  subject: any;
  message: any;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    from: process.env.EMAIL
  });

  const message = {
    from: 'MedTrack',
    to: options.email,
    subject: options.subject,
    text: options.message, 
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
