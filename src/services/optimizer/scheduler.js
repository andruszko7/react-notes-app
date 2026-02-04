// /src/services/optimizer/scheduler.js

const optimizerConfig = require("../../config/optimizerConfig");
const { runOptimizationCycle } = require("./runOptimizationCycle");

let intervalHandle = null;

/**
 * Start periodic D30 optimization cycles.
 */
function startOptimizerScheduler() {
  const minutes = optimizerConfig.optimizationFrequencyMinutes;
  const ms = minutes * 60 * 1000;

  if (intervalHandle) {
    clearInterval(intervalHandle);
  }

  console.log(`[D30] Starting optimizer scheduler: every ${minutes} minute(s).`);

  // Optional: initial one-off cycle at startup.
  setTimeout(async () => {
    try {
      const report = await runOptimizationCycle();
      console.log("[D30] Initial optimization cycle completed.", report.summary);
    } catch (e) {
      console.error("[D30] Initial optimization cycle failed:", e);
    }
  }, 0);

  intervalHandle = setInterval(async () => {
    try {
      const report = await runOptimizationCycle();
      console.log("[D30] Optimization cycle completed.", report.summary);
    } catch (e) {
      console.error("[D30] Optimization cycle failed:", e);
    }
  }, ms);
}

module.exports = {
  startOptimizerScheduler,
};