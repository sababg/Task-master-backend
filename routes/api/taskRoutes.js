import express from "express";
import mongoose from "mongoose";
import Project from "../../models/Project.js";
import Task from "../../models/Task";
import { authMiddleware } from "../../utils/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(404).json({ message: "Invalid project ID format!" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ message: "Can't find project with this id!" });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to make a note in this project!",
      });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      project: project._id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

router.get("/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(404).json({ message: "Invalid project ID format!" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ message: "Can't find project with this id!" });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to make a note in this project!",
      });
    }

    const tasks = await Task.find({ project: project._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

router.put("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ message: "Invalid task ID format!" });
    }

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }
    if (task.project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this note!" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ message: "Invalid task ID format!" });
    }

    const task = await Task.findById(taskId).populate("project");
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }
    if (task.project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this note!" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

export default router;
