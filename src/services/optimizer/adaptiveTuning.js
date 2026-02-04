
// /src/services/optimizer/adaptiveTuning.js

/**
 * D35 Adaptive Tuning Engine
 *
 * Adjusts scoring weights based on historical performance trends.
 * This enables the optimizer to become more sensitive to metrics
 * that are consistently problematic (e.g., latency spikes).
 */

function adaptiveTuning(history) {
  // Default weights
  let weights = {
    quality: 0.4,
    latency: 0.2,
    cost: 0.2,
    safety: 0.2,
  };

  if (!Array.isArray(history) || history.length < 2) {
    return weights; // Not enough data to adapt
  }

  const recent = history[history.length - 1];
  const previous = history[history.length - 2];

  // If quality is trending downward, increase its weight
  if (recent.qualityScore < previous.qualityScore) {
    weights.quality += 0.05;
  }

  // If latency is trending upward, increase its weight
  if (recent.latencyMs > previous.latencyMs) {
    weights.latency += 0.05;
  }

  // If cost is trending upward, increase its weight
  if (recent.cost > previous.cost) {
    weights.cost += 0.05;
  }

  // If safety incidents appear, increase safety weight
  if (!previous.safetyIncident && recent.safetyIncident) {
    weights.safety += 0.1;
  }

  // Normalize weights so they sum to 1
  const total =
    weights.quality + weights.latency + weights.cost + weights.safety;

  Object.keys(weights).forEach((key) => {
    weights[key] = parseFloat((weights[key] / total).toFixed(4));
  });

  return weights;
}

module.exports = { adaptiveTuning };