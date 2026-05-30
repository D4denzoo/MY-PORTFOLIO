// routes/projects.js — GET /api/projects
const express = require("express");
const router = express.Router();
const projectsData = require("../data/projects.json");

/**
 * GET /api/projects
 * Returns all projects. Supports query params:
 *   ?featured=true  — only featured projects
 *   ?category=Backend — filter by category
 */
router.get("/", (req, res) => {
  try {
    let projects = [...projectsData];

    // Filter by featured
    if (req.query.featured === "true") {
      projects = projects.filter((p) => p.featured);
    }

    // Filter by category
    if (req.query.category) {
      projects = projects.filter(
        (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects data",
    });
  }
});

/**
 * GET /api/projects/:id
 * Returns a single project by ID
 */
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projectsData.find((p) => p.id === id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with id ${id} not found`,
      });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch project" });
  }
});

module.exports = router;
