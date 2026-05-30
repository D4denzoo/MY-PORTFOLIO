// routes/profile.js — GET /api/profile
const express = require("express");
const router = express.Router();
const profileData = require("../data/profile.json");

/**
 * GET /api/profile
 * Returns the full profile data including skills, education, and experience
 */
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: profileData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile data",
    });
  }
});

/**
 * GET /api/profile/skills
 * Returns only the skills section
 */
router.get("/skills", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: profileData.skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
});

module.exports = router;
