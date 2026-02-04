// /src/services/evaluation/evaluationStore.js
// Simple in-memory or pluggable store for evaluation runs.
// Replace with real persistence in production.

let mockData = [];

/**
 * Seed mock data (for testing/demo).
 */
function seedMockEvaluations(evaluations) {
  mockData = evaluations;
}

/**
 * Return the most recent N evaluations.
 * Each entry shape:
 * {
 *   modelId, taskType, qualityScore, latencyMs,
 *   cost, safetyIncident (bool), timestamp
 * }
 */
async function getRecentEvaluations(n) {
  if (!mockData || mockData.length === 0) {
    return [];
  }
  return mockData.slice(-n);
}

module.exports = {
  getRecentEvaluations,
  seedMockEvaluations,
};