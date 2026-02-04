// /src/config/routingConfig.js

// Example routing configuration for D30 optimization.
// This file may be rewritten by the optimizer (changeApplier).

const routingConfig = {
  models: {
    modelA: {
      weight: 0.5,
      enabled: true,
      safetyScore: 0.99,
      avgQuality: 0.82,
      avgLatency: 800,
      avgCost: 0.002,
    },
    modelB: {
      weight: 0.3,
      enabled: true,
      safetyScore: 0.98,
      avgQuality: 0.79,
      avgLatency: 600,
      avgCost: 0.0015,
    },
    modelC: {
      weight: 0.2,
      enabled: true,
      safetyScore: 0.97,
      avgQuality: 0.77,
      avgLatency: 900,
      avgCost: 0.001,
    },
  },

  fallbackOrder: ["modelA", "modelB", "modelC"],

  taskRouting: {
    general: {
      preferredModels: ["modelA", "modelB"],
    },
    coding: {
      preferredModels: ["modelB"],
    },
    summarization: {
      preferredModels: ["modelA", "modelC"],
    },
  },

  safetyThresholds: {
    minSafetyScore: 0.95,
  },
};

module.exports = routingConfig;