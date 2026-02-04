// /src/services/optimizer/regressionDetector.js

function detectRegression(previous, current) {
  const regressions = [];

  if (current.qualityScore < previous.qualityScore) {
    regressions.push("quality");
  }

  if (current.latencyMs > previous.latencyMs) {
    regressions.push("latency");
  }

  if (current.cost > previous.cost) {
    regressions.push("cost");
  }

  if (!previous.safetyIncident && current.safetyIncident) {
    regressions.push("safety");
  }

  return regressions;
}

module.exports = { detectRegression };