import nodemailer from 'nodemailer';
import { type ISendEmailOptions } from '../types/sendEmailOptions';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const sendEmail = async (options: ISendEmailOptions): Promise<void> => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_EMAIL,
  //     pass: process.env.SMTP_PASSWORD,
  //   },

  // });

  const smtpConfig: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT as unknown as number,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(smtpConfig);

  const message = {
    from: `${process.env.SMTP_EMAIL_SENDER_NAME} <${process.env.SMTP_EMAIL_SENDER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(message);
};

export default sendEmail;
