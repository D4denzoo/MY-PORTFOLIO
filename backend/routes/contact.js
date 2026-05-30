// routes/contact.js — POST /api/contact
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// In-memory store for demo (replace with DB / email service in production)
const submissions = [];

/**
 * Validation rules for the contact form
 */
const contactValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("subject")
    .trim()
    .notEmpty().withMessage("Subject is required")
    .isLength({ min: 3, max: 120 }).withMessage("Subject must be between 3 and 120 characters"),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 10, max: 2000 }).withMessage("Message must be between 10 and 2000 characters"),
];

/**
 * POST /api/contact
 * Accepts a contact form submission
 */
router.post("/", contactValidation, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { name, email, subject, message } = req.body;

    const submission = {
      id: submissions.length + 1,
      name,
      email,
      subject,
      message,
      ip: req.ip,
      createdAt: new Date().toISOString(),
    };

    submissions.push(submission);

    // Log to console (in production, send an email or save to DB)
    console.log("\n📬 New Contact Submission:");
    console.log(`  From: ${name} <${email}>`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Message: ${message.substring(0, 80)}...`);

    res.status(201).json({
      success: true,
      message: "Your message has been received! I'll get back to you within 24 hours.",
      data: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});

/**
 * GET /api/contact/submissions  (optional dev-only route)
 * Returns all submissions (disable in production!)
 */
router.get("/submissions", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  res.json({ success: true, count: submissions.length, data: submissions });
});

module.exports = router;
