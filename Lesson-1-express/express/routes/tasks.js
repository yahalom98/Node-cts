const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/tasks.json");

// Get all tasks
router.get("/tasks", (req, res) => {
  try {
    const tasks = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to read tasks" });
  }
});

// Create a new task
router.post("/tasks", (req, res) => {
  try {
    const tasks = JSON.parse(fs.readFileSync(dataPath, "utf8")) || [];
    const newTask = {
      id: Date.now(),
      title: req.body.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

module.exports = router;
