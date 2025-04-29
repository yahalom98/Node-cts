const express = require('express');
const app = express();
const tasksRoute = require('./routes/tasks');
const PORT = 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api', tasksRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
