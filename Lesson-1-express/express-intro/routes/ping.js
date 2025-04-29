const express = require("express");
const router = express.Router();

// Ping route
router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

module.exports = router;
