const express = require("express");
const app = express();

// Import Log function
const Log = require("./logging_middleware/logger");

// Import Scheduler
const runScheduler = require("./vehicle_maintence_scheduler/scheduler");

// Middleware
app.use(express.json());

// 🔹 GET Root Route
app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Root route accessed");
  res.send("Backend is running 🚀");
});

// 🔹 POST Register Route
app.post("/register", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    await Log("backend", "error", "handler", "Missing name or email");
    return res.status(400).json({ message: "Missing fields" });
  }

  await Log("backend", "info", "controller", "User registered");

  res.json({
    message: "User registered successfully",
    data: { name, email }
  });
});

// 🔹 GET Scheduler Route
app.get("/schedule", async (req, res) => {
  try {
    const result = await runScheduler();

    res.json({
      message: "Scheduling completed successfully",
      maxImpact: result
    });
  } catch (err) {
    res.status(500).json({ message: "Scheduler failed" });
  }
});

// 🔹 Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});