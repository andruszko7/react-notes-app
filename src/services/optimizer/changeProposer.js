// /src/services/optimizer/changeProposer.js

const optimizerConfig = require("../../config/optimizerConfig");
const routingConfig = require("../../config/routingConfig");

/**
 * Propose routing weight changes based on analysis and allowed actions.
 * @param {Object} analysis
 * @param {Object} allowedActions
 * @returns {{changes: Array, riskLevel: string}}
 */
function proposeChanges(analysis, allowedActions) {
  const { models: analyzedModels } = analysis;
  const currentModels = routingConfig.models;
  const changeSet = {
    changes: [],
    riskLevel: "LOW",
  };

  if (!analyzedModels || !currentModels) return changeSet;

  const { maxWeightChangePerCycle, minQualityThreshold } = optimizerConfig;

  for (const [modelId, current] of Object.entries(currentModels)) {
    const metrics = analyzedModels[modelId];
    const policy = allowedActions[modelId];

    if (!metrics || !policy) continue;

    const { avgQuality } = metrics;
    const { canPromote, reasons } = policy;
    const currentWeight = current.weight ?? 0;

    let proposedWeight = currentWeight;

    if (canPromote && avgQuality > minQualityThreshold + 0.05) {
      proposedWeight = currentWeight + maxWeightChangePerCycle;
    } else if (reasons.belowQuality) {
      proposedWeight = currentWeight - maxWeightChangePerCycle;
    }

    if (proposedWeight < 0) proposedWeight = 0;
    if (proposedWeight > 1) proposedWeight = 1;

    if (proposedWeight !== currentWeight) {
      changeSet.changes.push({
        id: null, // will be assigned by applier
        type: "ROUTING_WEIGHT_UPDATE",
        modelId,
        from: currentWeight,
        to: proposedWeight,
        reason: buildReasonString(metrics, policy),
      });
    }
  }

  if (changeSet.changes.length > 3) {
    changeSet.riskLevel = "MEDIUM";
  }

  return changeSet;
}

function buildReasonString(metrics, policy) {
  const parts = [];
  parts.push(`avgQuality=${metrics.avgQuality.toFixed(3)}`);
  parts.push(`avgLatency=${metrics.avgLatency.toFixed(1)}ms`);
  parts.push(`avgCost=${metrics.avgCost.toFixed(6)}`);
  parts.push(
    `safetyIncidentRate=${(metrics.safetyIncidentRate * 100).toFixed(2)}%`
  );

  if (policy.reasons.belowQuality) {
    parts.push("belowQualityThreshold=true");
  }
  if (policy.reasons.unsafe) {
    parts.push("safetyConcern=true");
  }

  return parts.join("; ");
}

module.exports = {
  proposeChanges,
};