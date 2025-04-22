




<!-- Intro to Express.js -->

 What is a backend.

Why use Node.js and Express.js.

Express is a lightweight framework for handling HTTP requests.

Express = Node.js but easier, faster, and cleaner!


<!-- Project setup: folder structure, Nodemon, Postman -->

Step 1: Create a new folder express-intro
mkdir express-intro
cd express-intro
npm init -y
*Creates a package.json file.*

Step 2: Install Express and Nodemon
npm install express
npm install --save-dev nodemon

Update your package.json scripts:
"scripts": {
  "start": "nodemon index.js"
}

Step 3: Create your first file:
Create /index.js:

const express = require('express');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



<!-- Create your first API route (/api/ping) -->
Step 1: In /index.js, add:
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong!' });
});


<!-- Organize Project: Folder Structure -->
Step 1: Create folders:
mkdir routes
mkdir data


Step 2: Move /api/ping to a new file:
Create /routes/ping.js:

const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'pong from router!' });
});
module.exports = router;


In /index.js, update:
const express = require('express');
const app = express();
const pingRoute = require('./routes/ping');
const PORT = 3000;

app.use('/api', pingRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

Test /api/ping again in Postman.


 <!-- Mini project: Simple "Task Tracker API"-->

<!-- Part 1 — create -->
Step 1: Create /routes/tasks.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/tasks.json');

// Get all tasks
router.get('/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(dataPath));
  res.json(tasks);
});

module.exports = router;
In /index.js, add:


const tasksRoute = require('./routes/tasks');
app.use('/api', tasksRoute);
✅ Task: Create /data/tasks.json


<!-- Part 2 — Create, Update, Delete -->
Step 2: Add POST (create task) inside /routes/tasks.js:

router.post('/tasks', express.json(), (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(dataPath));
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});
✅ Task: Use Postman: Send POST to /api/tasks with Body -> raw -> JSON:

{ "title": "Learn Express" }
See new task created!

<!-- Step 3: Add PATCH (update task): -->

router.patch('/tasks/:id', express.json(), (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(dataPath));
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }

  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
  res.json(task);
});

✅ Task:Update a task's completed status in Postman:

{ "completed": true }

<!-- Step 4: Add DELETE (remove task): -->

router.delete('/tasks/:id', (req, res) => {
  let tasks = JSON.parse(fs.readFileSync(dataPath));
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);

  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
  res.status(204).send();
});
✅ Task: Send DELETE request in Postman to /api/tasks/:id

 <!-- 15 min — Recap & Clean Up -->
Review folder structure:
express-intro/
├── data/
│   └── tasks.json
├── routes/
│   ├── ping.js
│   └── tasks.js
├── index.js
├── package.json
Discuss HTTP methods: GET, POST, PATCH, DELETE.

Quick Q&A.

✅ /index.js

✅ /routes/ping.js

✅ /routes/tasks.js

✅ /data/tasks.json

✅ /package.json


