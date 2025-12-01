import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
});

export async function sendVerificationEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@digital-menu.local',
      to: email,
      subject: 'Digital Menu - Verification Code',
      html: `
        <h2>Verify Your Email</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #2563eb; font-family: monospace; letter-spacing: 2px;">${code}</h1>
        <p>This code will expire in 30 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
      text: `Your verification code is: ${code}. This code will expire in 30 minutes.`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}
