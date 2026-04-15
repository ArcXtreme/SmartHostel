const nodemailer = require("nodemailer");

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendMail({ to, subject, text }) {
  const transport = getTransport();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@smarthostel.local";

  if (!transport) {
    // Dev fallback: don't hard-fail when SMTP isn't configured.
    console.warn("[email] SMTP not configured. Email content:", { to, subject, text });
    return { delivered: false };
  }

  await transport.sendMail({ from, to, subject, text });
  return { delivered: true };
}

module.exports = { sendMail };

