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
    return res
      .status(500)
      .json({ message: "Server error.", error: err.message });
  }
});

export default router;
