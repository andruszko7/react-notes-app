// /src/config/optimizerConfig.js

const optimizerConfig = {
  // Frequency in minutes for scheduled optimization cycles.
  optimizationFrequencyMinutes: 60,

  // Relative importance of each metric.
  objectiveWeights: {
    quality: 0.6,
    latency: 0.2,
    cost: 0.2,
  },

  // Maximum allowed fractional change to routing weights per cycle.
  maxWeightChangePerCycle: 0.1, // 10%

  // Minimum acceptable quality to consider promotion.
  minQualityThreshold: 0.75,

  // Safety rules that must never be relaxed automatically.
  safetyHardLimits: {
    allowSafetyRelaxation: false,
    maxSafetyIncidentRate: 0.01, // 1%
  },

  // "AUTO_APPLY" -> low-risk changes auto-applied.
  // "REVIEW_REQUIRED" -> all changes queued for review.
  approvalMode: "REVIEW_REQUIRED",

  // When true, D30 proposes and logs changes but does not modify routingConfig.
  dryRun: true,

  // How many recent evaluations to consider in analysis.
  analysisWindowSize: 100,

  // Thresholds for detecting drift in metrics.
  driftThresholds: {
    qualityDrop: 0.05,
    latencyIncrease: 0.1,
    costIncrease: 0.1,
  },
};

module.exports = optimizerConfig;