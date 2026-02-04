// /src/services/optimizer/orchestrator.js

const { getEvaluations } = require("../evaluation/evaluationStore");
const { computePolicyAwareScore } = require("./scoringEngine");
const { adaptiveTuning } = require("./adaptiveTuning");
const { detectRegression } = require("./regressionDetector");
const { evaluatePolicies, filterAllowedCandidates } = require("./policyEngine");
const { selectEnsemble } = require("./ensembleSelector");
const { buildDecisionAudit } = require("./decisionAudit");

/**
 * D40: Full Optimizer Orchestration Layer
 *
 * Orchestrates:
 *  - evaluations
 *  - policy filtering
 *  - adaptive tuning
 *  - policy-aware scoring
 *  - ensemble selection
 *  - regression detection
 *  - audit record generation
 *
 * Returns a high-level routing decision object.
 */

async function orchestrateOptimization() {
  const evaluations = getEvaluations();

  if (!evaluations || evaluations.length === 0) {
    return {
      summary: "No evaluations available",
      decision: null,
      audit: buildDecisionAudit({}),
    };
  }

  // D36: Policy filtering
  const allowed = filterAllowedCandidates(evaluations);
  const policyViolations = evaluations
    .map((e) => ({
      modelId: e.modelId,
      ...evaluatePolicies(e),
    }))
    .filter((r) => !r.allowed);

  if (allowed.length === 0) {
    const audit = buildDecisionAudit({
      evaluations,
      policyViolations,
      regressions: [],
      scoredCandidates: [],
      bestModel: null,
      ensemble: [],
      tuningWeights: {},
    });

    return {
      summary: "All candidates violated policy constraints",
      decision: null,
      audit,
    };
  }

  // D35: Adaptive tuning
  const tuningWeights = adaptiveTuning(evaluations);

  // D37: Policy-aware scoring
  const scoredCandidates = allowed.map((e) => {
    const policyResult = evaluatePolicies(e);
    const score = computePolicyAwareScore(
      {
        qualityScore: e.qualityScore,
        latencyMs: e.latencyMs,
        cost: e.cost,
        safetyIncident: e.safetyIncident,
      },
      tuningWeights,
      policyResult
    );
    return { ...e, score };
  });

  // D34: Regression detection
  let regressions = [];
  if (evaluations.length >= 2) {
    const prev = evaluations[evaluations.length - 2];
    const curr = evaluations[evaluations.length - 1];
    regressions = detectRegression(prev, curr);
  }

  // D38: Ensemble selection
  const { best, ensemble } = selectEnsemble(scoredCandidates, 3);

  // D39: Decision audit
  const audit = buildDecisionAudit({
    evaluations,
    policyViolations,
    tuningWeights,
    scoredCandidates,
    bestModel: best,
    ensemble,
    regressions,
  });

  const decision = best
    ? {
        type: ensemble.length > 1 ? "ensemble" : "single",
        primaryModelId: best.modelId,
        ensembleModelIds: ensemble.map((m) => m.modelId),
      }
    : null;

  return {
    summary: best
      ? `Orchestration complete. Selected primary model: ${best.modelId}`
      : "Orchestration complete. No model selected.",
    decision,
    audit,
  };
}

module.exports = { orchestrateOptimization };