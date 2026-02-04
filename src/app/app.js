// /src/app.js

const express = require("express");
const { startOptimizerScheduler } = require("./services/optimizer/scheduler");
const {
  runOptimizerHandler,
  getOptimizerReportHandler,
  approveChangeHandler,
  rejectChangeHandler,
} = require("./services/optimizer/optimizerController");

const app = express();
app.use(express.json());

// D30 optimizer endpoints
app.post("/optimizer/run", runOptimizerHandler);
app.get("/optimizer/report", getOptimizerReportHandler);
app.post("/optimizer/approve/:id", approveChangeHandler);
app.post("/optimizer/reject/:id", rejectChangeHandler);

// Healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start D30 scheduler
startOptimizerScheduler();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CP-503 server running on port ${port}`);
});

module.exports = app;