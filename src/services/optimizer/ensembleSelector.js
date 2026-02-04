// /src/services/optimizer/ensembleSelector.js

/**
 * D38: Multi-Model Ensemble Selection
 *
 * Given a list of scored candidates:
 *   [{ modelId, score, ... }, ...]
 *
 * Returns:
 *  - best: top-scoring model
 *  - ensemble: top-k models (default 3)
 */

function selectEnsemble(candidates, topK = 3) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return { best: null, ensemble: [] };
  }

  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const ensemble = sorted.slice(0, Math.min(topK, sorted.length));

  return { best, ensemble };
}

module.exports = { selectEnsemble };