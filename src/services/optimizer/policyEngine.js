// /src/services/optimizer/policyEngine.js

/**
 * D36 Policy Engine
 *
 * Evaluates a model evaluation against a set of policies.
 * Returns an object describing:
 *  - allowed: boolean
 *  - violations: array of strings describing violated policies
 *
 * Policies are intentionally simple and explicit for traceability.
 */

function evaluatePolicies(evaluation, config = {}) {
  const {
    maxCost = 0.005,
    maxLatencyMs = 1200,
    requireNoSafetyIncidents = true,
    minQualityScore = 0.6,
  } = config;

  const violations = [];

  if (requireNoSafetyIncidents && evaluation.safetyIncident) {
    violations.push("safety_incident");
  }

  if (evaluation.cost > maxCost) {
    violations.push("cost_exceeds_max");
  }

  if (evaluation.latencyMs > maxLatencyMs) {
    violations.push("latency_exceeds_max");
  }

  if (evaluation.qualityScore < minQualityScore) {
    violations.push("quality_below_min");
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}

/**
 * Filters a list of candidate models based on policies.
 * Returns only those that are allowed.
 */
function filterAllowedCandidates(evaluations, config = {}) {
  return evaluations.filter((evalItem) => {
    const result = evaluatePolicies(evalItem, config);
    return result.allowed;
  });
}

module.exports = {
  evaluatePolicies,
  filterAllowedCandidates,
};