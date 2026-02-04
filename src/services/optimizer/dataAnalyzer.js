// /src/services/optimizer/dataAnalyzer.js

const optimizerConfig = require("../../config/optimizerConfig");
const evaluationStore = require("../evaluation/evaluationStore");

/**
 * Analyze recent evaluation data and compute metrics per model.
 * @returns {Promise<{models: Object, summary: Object}>}
 */
async function analyzeData() {
  const windowSize = optimizerConfig.analysisWindowSize;
  const history = await evaluationStore.getRecentEvaluations(windowSize);

  if (!history || history.length === 0) {
    return { models: {}, summary: { totalSamples: 0, analyzedModels: 0 } };
  }

  const models = {};
  let totalSamples = 0;

  for (const entry of history) {
    const {
      modelId,
      qualityScore,
      latencyMs,
      cost,
      safetyIncident,
    } = entry;

    totalSamples += 1;

    if (!models[modelId]) {
      models[modelId] = {
        count: 0,
        totalQuality: 0,
        totalLatency: 0,
        totalCost: 0,
        safetyIncidentCount: 0,
      };
    }

    const m = models[modelId];
    m.count += 1;
    m.totalQuality += qualityScore;
    m.totalLatency += latencyMs;
    m.totalCost += cost;
    if (safetyIncident) {
      m.safetyIncidentCount += 1;
    }
  }

  const analysisModels = {};
  for (const [modelId, stats] of Object.entries(models)) {
    const avgQuality = stats.totalQuality / stats.count;
    const avgLatency = stats.totalLatency / stats.count;
    const avgCost = stats.totalCost / stats.count;
    const safetyIncidentRate =
      stats.count > 0 ? stats.safetyIncidentCount / stats.count : 0;

    analysisModels[modelId] = {
      count: stats.count,
      avgQuality,
      avgLatency,
      avgCost,
      safetyIncidentRate,
    };
  }

  return {
    models: analysisModels,
    summary: {
      totalSamples,
      analyzedModels: Object.keys(analysisModels).length,
    },
  };
}

module.exports = {
  analyzeData,
};