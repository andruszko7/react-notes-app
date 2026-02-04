// /src/services/optimizer/optimizerReport.js

/**
 * Build a structured optimizer report object.
 * @param {Object} analysis
 * @param {Object} changeSet
 * @param {Object} applyResult
 * @returns {Object} report
 */
function buildOptimizerReport(analysis, changeSet, applyResult) {
  return {
    timestamp: new Date().toISOString(),
    summary: analysis.summary || {},
    changesProposed: (changeSet && changeSet.changes) || [],
    riskLevel: changeSet ? changeSet.riskLevel : "NONE",
    applied: applyResult ? applyResult.applied : [],
    pending: applyResult ? applyResult.pending : [],
    dryRun: applyResult ? applyResult.dryRun : false,
    message: applyResult ? applyResult.message : "No changes.",
  };
}

module.exports = {
  buildOptimizerReport,
};