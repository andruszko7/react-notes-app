// /src/services/optimizer/scoringEngine.js

/**
 * D33: Base multi-objective scoring
 * Uses fixed weights for quality, latency, cost, and safety.
 */

function computeScore({ qualityScore, latencyMs, cost, safetyIncident }) {
  const qualityWeight = 0.4;
  const latencyWeight = 0.2;
  const costWeight = 0.2;
  const safetyWeight = 0.2;

  const normalizedLatency = Math.max(0, 1 - latencyMs / 1000); // lower is better
  const normalizedCost = Math.max(0, 1 - cost / 0.005);        // lower is better
  const safetyPenalty = safetyIncident ? 0 : 1;                 // binary penalty

  const score =
    qualityScore * qualityWeight +
    normalizedLatency * latencyWeight +
    normalizedCost * costWeight +
    safetyPenalty * safetyWeight;

  return parseFloat(score.toFixed(4));
}

/**
 * D37: Policy-aware hybrid scoring
 *
 * - Accepts dynamic weights (e.g., from adaptiveTuning)
 * - Accepts policy evaluation output (e.g., from evaluatePolicies)
 * - Applies additional penalties for policy violations/risk signals.
 *
 * `weights` should be an object:
 *   { quality, latency, cost, safety }
 *
 * `policyContext` can include:
 *   { allowed: boolean, violations: string[] }
 */

function computePolicyAwareScore(
  { qualityScore, latencyMs, cost, safetyIncident },
  weights,
  policyContext = {}
) {
  const {
    quality = 0.4,
    latency = 0.2,
    cost: costW = 0.2,
    safety = 0.2,
  } = weights || {};

  const normalizedLatency = Math.max(0, 1 - latencyMs / 1000);
  const normalizedCost = Math.max(0, 1 - cost / 0.005);
  const safetyBase = safetyIncident ? 0 : 1;

  let baseScore =
    qualityScore * quality +
    normalizedLatency * latency +
    normalizedCost * costW +
    safetyBase * safety;

  // Policy-aware adjustment
  const { allowed = true, violations = [] } = policyContext;

  if (!allowed) {
    // Hard penalty for disallowed candidates
    baseScore *= 0.1;
  } else if (violations.length > 0) {
    // Softer penalty when there are non-fatal policy signals
    baseScore *= 0.8;
  }

  return parseFloat(baseScore.toFixed(4));
}

module.exports = {
  computeScore,
  computePolicyAwareScore,
};