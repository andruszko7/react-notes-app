// /src/services/optimizer/runOptimizationCycle.js

/**
 * D30 → D40 Refactor:
 *
 * This file now delegates the entire optimization process
 * to the D40 Orchestration Layer.
 *
 * This preserves backward compatibility for any existing
 * code that still calls runOptimizationCycle(), while
 * ensuring all new logic flows through the orchestrator.
 */

const { orchestrateOptimization } = require("./orchestrator");

async function runOptimizationCycle() {
  const result = await orchestrateOptimization();

  return {
    summary: result.summary,
    bestModel: result.decision
      ? { modelId: result.decision.primaryModelId }
      : null,
    tuningWeights: result.audit.tuningWeights,
    regressions: result.audit.regressions,
    policyViolations: result.audit.policyViolations,
    changesProposed: result.decision
      ? [
          {
            action:
              result.decision.type === "ensemble"
                ? "select_ensemble"
                : "select_model",
            modelId: result.decision.primaryModelId,
            ensemble: result.decision.ensembleModelIds,
            reason: "selected via orchestrator",
          },
        ]
      : [],
    audit: result.audit,
  };
}

module.exports = { runOptimizationCycle };