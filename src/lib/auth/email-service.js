import emailjs from '@emailjs/browser';
import 'dotenv/config';

export async function sendVerificationEmail(email, token) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const params = {
    to_email: email,
    to_name: email.split('@')[0],
    verification_link: verificationLink,
  };

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      'verification_email',
      params,
      process.env.EMAILJS_PUBLIC_KEY
    );
  } catch {
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(email, token) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const params = {
    reset_link: resetLink,
    to_email: email,
    to_name: email.split('@')[0],
  };

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      'password_reset_email',
      params,
      process.env.EMAILJS_PUBLIC_KEY
    );
  } catch {
    throw new Error('Failed to send password reset email');
  }
}
