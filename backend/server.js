// ═══════════════════════════════════════════════
//  DENZEL OSWARD CHILEWA — Portfolio Backend API
// ═══════════════════════════════════════════════

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 5000;
const GITHUB_USERNAME = "D4denzoo";

// ─── MIDDLEWARE ────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ─── PROFILE DATA ─────────────────────────────
const profile = {
  name: "Denzel Osward Chilewa",
  title:
    "Data Scientist | Machine Learning Enthusiast | Backend Developer",
  email: "denzelosward109@gmail.com",
  phone: "+255 756 227 279",
  location: "Dar es Salaam, Tanzania",
  github: `https://github.com/${GITHUB_USERNAME}`,
  bio: "A passionate Data Science student with strong interest in machine learning, data analytics, artificial intelligence, backend systems, and modern web technologies.",
};

// ─── SKILLS DATA ──────────────────────────────
const skills = [
  { name: "Python", category: "data-science", level: 90 },
  { name: "R Programming", category: "data-science", level: 80 },
  { name: "SQL", category: "data-science", level: 85 },
  { name: "Statistics", category: "data-science", level: 88 },
  { name: "Machine Learning", category: "ml", level: 82 },
  { name: "Data Analysis", category: "ml", level: 87 },
  { name: "Data Visualization", category: "ml", level: 80 },
  { name: "Power BI", category: "ml", level: 75 },
  { name: "Django", category: "development", level: 78 },
  { name: "REST APIs", category: "development", level: 80 },
  { name: "HTML/CSS", category: "development", level: 85 },
  { name: "JavaScript", category: "development", level: 75 },
  { name: "Bootstrap", category: "development", level: 85 },
  { name: "Git & GitHub", category: "development", level: 88 },
  { name: "Excel", category: "data-science", level: 82 },
];

// ─── HEALTH ROUTE ─────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Denzel Portfolio API running successfully",
  });
});

// ─── PROFILE ROUTE ────────────────────────────
app.get("/api/profile", (req, res) => {
  res.json({
    success: true,
    data: profile,
  });
});

// ─── SKILLS ROUTE ─────────────────────────────
app.get("/api/skills", (req, res) => {
  res.json({
    success: true,
    data: skills,
  });
});

// ─── PROJECTS ROUTE ───────────────────────────
app.get("/api/projects", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`
    );

    const projects = response.data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
      }));

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch GitHub projects",
    });
  }
});

// ─── CONTACT ROUTE ────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "denzelosward109@gmail.com",
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// ─── 404 ROUTE ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── START SERVER ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Denzel Portfolio API running on port ${PORT}`);
});

module.exports = app;