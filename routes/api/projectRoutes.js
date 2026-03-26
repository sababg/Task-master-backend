import express from "express";
import Project from "../../models/Project.js";

const router = express.Router();

import { authMiddleware } from "../../utils/auth.js";

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const project = await Project.create({
      name,
      description,
      user: req.user._id,
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    return res.status(201).json(projects);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: "Server error.", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.status(201).json(project);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    return res.json(project);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.json({ message: "Project deleted." });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});

export default router;
