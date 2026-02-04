// /src/tests/optimizer/optimizer.test.js

const { seedMockEvaluations } = require("../../services/evaluation/evaluationStore");
const { runOptimizationCycle } = require("../../services/optimizer/runOptimizationCycle");

describe("D30 Optimizer End-to-End", () => {
  test("runs a full cycle with synthetic data", async () => {
    seedMockEvaluations([
      {
        modelId: "modelA",
        taskType: "general",
        qualityScore: 0.9,
        latencyMs: 800,
        cost: 0.002,
        safetyIncident: false,
        timestamp: Date.now(),
      },
      {
        modelId: "modelB",
        taskType: "general",
        qualityScore: 0.7,
        latencyMs: 700,
        cost: 0.0015,
        safetyIncident: false,
        timestamp: Date.now(),
      },
    ]);

    const report = await runOptimizationCycle();

    expect(report).toHaveProperty("summary");
    expect(report).toHaveProperty("changesProposed");
    expect(Array.isArray(report.changesProposed)).toBe(true);
  });
});