require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const GITHUB_USERNAME = 'D4denzoo';

// ─── MIDDLEWARE ───
// Allow ALL origins — fixes CORS hanging issue
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── PROFILE DATA ───
const profile = {
  name: 'Denzel Osward Chilewa',
  title: 'Data Scientist | Machine Learning Enthusiast | Backend Developer',
  email: 'denzelosward109@gmail.com',
  phone: '+255 756 227 279',
  location: 'Dar es Salaam, Tanzania',
  github: `https://github.com/${GITHUB_USERNAME}`,
  bio: 'A passionate Data Science student with strong interest in machine learning, data analytics, artificial intelligence, backend systems, and modern web technologies.'
};

// ─── SKILLS DATA ───
const skills = [
  { name: 'Python',             category: 'data-science', level: 90 },
  { name: 'R Programming',      category: 'data-science', level: 80 },
  { name: 'SQL',                category: 'data-science', level: 85 },
  { name: 'Statistics',         category: 'data-science', level: 88 },
  { name: 'Machine Learning',   category: 'ml',           level: 82 },
  { name: 'Data Analysis',      category: 'ml',           level: 87 },
  { name: 'Data Visualization', category: 'ml',           level: 80 },
  { name: 'Power BI',           category: 'ml',           level: 75 },
  { name: 'Django',             category: 'development',  level: 78 },
  { name: 'REST APIs',          category: 'development',  level: 80 },
  { name: 'HTML/CSS',           category: 'development',  level: 85 },
  { name: 'JavaScript',         category: 'development',  level: 75 },
  { name: 'Bootstrap',          category: 'development',  level: 85 },
  { name: 'Git & GitHub',       category: 'development',  level: 88 },
  { name: 'Excel',              category: 'data-science', level: 82 }
];

// ─── IN-MEMORY MESSAGE STORE ───
const messages = [];

// ─── ROUTES ───

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Denzel Portfolio API running ✓' });
});

// GET /api/profile
app.get('/api/profile', (_req, res) => {
  res.json({ success: true, data: profile });
});

// GET /api/skills
app.get('/api/skills', (_req, res) => {
  res.json({ success: true, data: skills });
});

// GET /api/projects
app.get('/api/projects', async (_req, res) => {
  try {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const { data: repos } = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      { headers, timeout: 8000 }
    );
    const projects = repos.filter(r => !r.fork).map(r => ({
      id: r.id, name: r.name, description: r.description,
      url: r.html_url, homepage: r.homepage, language: r.language,
      stars: r.stargazers_count, forks: r.forks_count,
      updatedAt: r.updated_at
    }));
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(502).json({ success: false, message: 'Failed to fetch GitHub repos', error: err.message });
  }
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // Save message
  const entry = { id: Date.now(), name, email, subject, message, receivedAt: new Date().toISOString() };
  messages.push(entry);
  console.log(`✓ New contact message from ${name} (${email})`);

  // Send email (only if credentials exist)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: 'denzelosward109@gmail.com',
        replyTo: email,
        subject: `[Portfolio] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:20px;">
            <h2 style="color:#3b82f6;margin-bottom:20px;">📬 New Portfolio Message</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:10px;background:#f8fafc;font-weight:600;width:100px;">Name</td><td style="padding:10px;">${name}</td></tr>
              <tr><td style="padding:10px;font-weight:600;">Email</td><td style="padding:10px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:10px;background:#f8fafc;font-weight:600;">Subject</td><td style="padding:10px;background:#f8fafc;">${subject}</td></tr>
            </table>
            <div style="padding:20px;background:#f1f5f9;border-radius:8px;border-left:4px solid #3b82f6;">
              <p style="margin:0;white-space:pre-wrap;line-height:1.6;">${message}</p>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Sent from your portfolio contact form</p>
          </div>
        `
      });
      console.log(`✓ Email sent to denzelosward109@gmail.com`);
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
      // Still return success — message is saved
    }
  } else {
    console.warn('⚠ Email credentials not set — skipping email send');
  }

  // Always return success
  res.status(201).json({
    success: true,
    message: "Message received! I'll respond within 24 hours.",
    data: { id: entry.id, receivedAt: entry.receivedAt }
  });
});

// GET /api/messages (admin)
app.get('/api/messages', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  res.json({ success: true, count: messages.length, data: messages });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Denzel Portfolio API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/\n`);
});

module.exports = app;
