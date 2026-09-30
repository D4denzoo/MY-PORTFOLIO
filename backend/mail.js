const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const CONTACT_TO = 'denzelosward109@gmail.com';

function envValue(name) {
  return String(process.env[name] || '').trim().replace(/^['"]|['"]$/g, '');
}

function isUsableSecret(value) {
  const v = String(value || '').trim();
  if (!v) return false;
  return !/^(none|null|undefined|false|empty|n\/a|-)$/i.test(v);
}

function gmailCredentials() {
  const user = envValue('EMAIL_USER');
  const pass = envValue('EMAIL_PASS').replace(/\s+/g, '');
  return {
    user,
    pass,
    configured: isUsableSecret(user) && isUsableSecret(pass)
  };
}

function resendCredentials() {
  const key = envValue('RESEND_API_KEY');
  return {
    key,
    configured: isUsableSecret(key)
  };
}

function selectedProvider() {
  const provider = envValue('EMAIL_PROVIDER').toLowerCase();
  if (provider === 'resend' || provider === 'gmail') return provider;
  return 'none';
}

function emailStatus() {
  const gmail = gmailCredentials();
  const resend = resendCredentials();
  return {
    provider: selectedProvider(),
    gmailConfigured: gmail.configured,
    resendConfigured: resend.configured
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function contactEmailHtml({ name, email, subject, message }) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:20px;">
      <h2 style="margin-bottom:20px;">New portfolio message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <div style="padding:16px;background:#f4f1ea;border-radius:8px;">
        <p style="margin:0;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
      </div>
    </div>
  `;
}

function safeErrorText(value) {
  let text = String(value || 'Unknown email error');
  const secrets = [envValue('RESEND_API_KEY'), gmailCredentials().pass].filter(isUsableSecret);
  secrets.forEach((secret) => {
    text = text.split(secret).join('[redacted]');
  });
  return text.replace(/re_[A-Za-z0-9]+/g, '[redacted]');
}

function publicEmailError(err) {
  const text = String((err && err.message) || '');
  if (err && err.code === 'EMAIL_NOT_CONFIGURED') {
    return 'Email is not configured on the server.';
  }
  if (/invalid login|badcredentials|username and password not accepted|535/i.test(text)) {
    return 'Gmail rejected the mailbox password. Recreate the App Password for denzelosward109@gmail.com and update EMAIL_PASS on Render.';
  }
  return 'Unable to deliver your message right now. Please try again later.';
}

async function sendWithGmail(payload) {
  const { user, pass } = gmailCredentials();
  const to = envValue('CONTACT_TO') || CONTACT_TO;
  const html = contactEmailHtml(payload);
  const setups = [
    { host: 'smtp.gmail.com', port: 587, secure: false, requireTLS: true },
    { host: 'smtp.gmail.com', port: 465, secure: true }
  ];

  console.log('Attempting to send email via Gmail SMTP');

  let lastError;
  for (const setup of setups) {
    try {
      const transporter = nodemailer.createTransport({
        ...setup,
        auth: { user, pass }
      });
      const info = await transporter.sendMail({
        from: user,
        to,
        replyTo: payload.email,
        subject: `[Portfolio] ${payload.subject}`,
        html
      });
      return { id: info && info.messageId ? info.messageId : '' };
    } catch (err) {
      lastError = err;
      console.error(`Gmail SMTP ${setup.port} failed: ${safeErrorText(err && err.message)}`);
    }
  }
  throw lastError;
}

async function sendWithResend(payload) {
  const { key } = resendCredentials();
  const resend = new Resend(key);
  const from = envValue('CONTACT_FROM') || 'Portfolio <onboarding@resend.dev>';
  const to = envValue('CONTACT_TO') || CONTACT_TO;
  console.log('Attempting to send email via Resend');
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject}`,
    html: contactEmailHtml(payload)
  });
  if (error) {
    throw new Error(error.message || 'Resend rejected the message');
  }
  return { id: data && data.id ? data.id : '' };
}

async function deliverContactEmail(payload) {
  const provider = selectedProvider();

  if (provider === 'resend') {
    if (!resendCredentials().configured) {
      const error = new Error('Resend is not configured');
      error.code = 'EMAIL_NOT_CONFIGURED';
      throw error;
    }
    console.log('Email provider selected: resend');
    return sendWithResend(payload);
  }

  if (provider === 'gmail') {
    if (!gmailCredentials().configured) {
      const error = new Error('Gmail is not configured');
      error.code = 'EMAIL_NOT_CONFIGURED';
      throw error;
    }
    console.log('Email provider selected: gmail');
    return sendWithGmail(payload);
  }

  console.log('Email provider selected: none');
  const error = new Error('No valid email provider configured');
  error.code = 'EMAIL_NOT_CONFIGURED';
  throw error;
}

module.exports = {
  deliverContactEmail,
  emailStatus,
  publicEmailError
};
