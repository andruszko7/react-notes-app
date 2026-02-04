// /src/services/optimizer/optimizerController.js

const fs = require("fs");
const path = require("path");
const { runOptimizationCycle } = require("./runOptimizationCycle");

const pendingChangesPath = path.join(__dirname, "../../data/pendingChanges.json");

function loadPendingChanges() {
  if (!fs.existsSync(pendingChangesPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(pendingChangesPath, "utf8"));
  } catch (e) {
    console.error("[D30] Failed to read pendingChanges.json:", e);
    return [];
  }
}

function savePendingChanges(changes) {
  fs.writeFileSync(pendingChangesPath, JSON.stringify(changes, null, 2), "utf8");
}

/**
 * POST /optimizer/run
 */
async function runOptimizerHandler(req, res) {
  try {
    const report = await runOptimizationCycle();
    res.status(200).json(report);
  } catch (e) {
    console.error("[D30] Manual optimizer run failed:", e);
    res.status(500).json({ error: "Optimizer run failed." });
  }
}

/**
 * GET /optimizer/report
 * For now, it runs a fresh cycle and returns the report.
 */
async function getOptimizerReportHandler(req, res) {
  try {
    const report = await runOptimizationCycle();
    res.status(200).json(report);
  } catch (e) {
    console.error("[D30] Getting optimizer report failed:", e);
    res.status(500).json({ error: "Failed to generate report." });
  }
}

/**
 * POST /optimizer/approve/:id
 */
function approveChangeHandler(req, res) {
  const { id } = req.params;
  const changes = loadPendingChanges();
  const idx = changes.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Change not found." });
  }
  changes[idx].status = "APPROVED";
  changes[idx].approvedAt = new Date().toISOString();
  savePendingChanges(changes);
  // NOTE: Implementation for applying approved changes to routingConfig
  // would be added here if you want manual apply separate from auto apply.
  res.status(200).json({ message: "Change approved.", change: changes[idx] });
}

/**
 * POST /optimizer/reject/:id
 */
function rejectChangeHandler(req, res) {
  const { id } = req.params;
  const changes = loadPendingChanges();
  const idx = changes.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Change not found." });
  }
  changes[idx].status = "REJECTED";
  changes[idx].rejectedAt = new Date().toISOString();
  savePendingChanges(changes);
  res.status(200).json({ message: "Change rejected.", change: changes[idx] });
}

module.exports = {
  runOptimizerHandler,
  getOptimizerReportHandler,
  approveChangeHandler,
  rejectChangeHandler,
};