import emailjs from '@emailjs/browser';

emailjs.init({
  blockHeadless: true,
  blockList: { '*': false },
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
});

export async function sendVerificationEmail(email, verificationLink) {
  const response = await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    process.env.NEXT_PUBLIC_EMAILJS_EMAIL_CONFIRMATION_TEMPLATEID,
    { email, link: verificationLink }
  );

  if (response.status !== 200) throw new Error(response.text);
  return response;
}

export async function sendPasswordResetEmail(email, resetLink) {
  const response = await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    process.env.NEXT_PUBLIC_EMAILJS_PASSWORD_RESET_TEMPLATEID,
    { email, link: resetLink }
  );

  if (response.status !== 200) throw new Error(response.text);
  return response;
}

export async function sendPasswordResetConfirmationEmail(email) {
  const response = await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    process.env.NEXT_PUBLIC_EMAILJS_PASSWORD_RESET_TEMPLATEID,
    { email }
  );

  if (response.status !== 200) throw new Error(response.text);
  return response;
}
