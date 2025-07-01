import emailjs from '@emailjs/browser';

emailjs.init({
  // Optionally add these for better security:
  blockHeadless: true,

  // Blocks automated requests
  blockList: {
    // Block specific elements from being auto-filled
    // by EmailJS's smart form detection
    '*': false,
  },
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
});

export async function sendVerificationEmail(email, verificationLink) {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_EMAIL_CONFIRMATION_TEMPLATEID,
      {
        email,
        link: verificationLink,
      }
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function sendPasswordResetEmail(email, resetLink) {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_PASSWORD_RESET_TEMPLATEID,
      {
        email,
        link: resetLink,
      }
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
