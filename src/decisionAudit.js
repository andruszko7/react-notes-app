// /src/services/optimizer/decisionAudit.js

/**
 * D39: Decision Audit & Traceability
 *
 * Builds a structured decision record describing:
 *  - input evaluations
 *  - policy results
 *  - scores and weights used
 *  - selected model(s)
 *  - regressions and rationale
 */

function buildDecisionAudit({
  evaluations,
  policyViolations,
  tuningWeights,
  scoredCandidates,
  bestModel,
  ensemble,
  regressions,
}) {
  return {
    timestamp: new Date().toISOString(),
    evaluations: evaluations || [],
    policyViolations: policyViolations || [],
    tuningWeights: tuningWeights || {},
    scoredCandidates: scoredCandidates || [],
    bestModel: bestModel || null,
    ensemble: ensemble || [],
    regressions: regressions || [],
    rationale: {
      hasRegressions: Array.isArray(regressions) && regressions.length > 0,
      policyStrict: true,
      selectionStrategy: ensemble && ensemble.length > 1 ? "ensemble" : "single_best",
    },
  };
}

module.exports = { buildDecisionAudit };