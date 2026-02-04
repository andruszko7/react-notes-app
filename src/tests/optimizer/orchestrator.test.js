// /src/tests/optimizer/orchestrator.test.js

const { orchestrateOptimization } = require("../../services/optimizer/orchestrator");
const { seedMockEvaluations, clearEvaluations } = require("../../services/evaluation/evaluationStore");

describe("D40 Full Optimizer Orchestration Layer", () => {
  beforeEach(() => {
    if (typeof clearEvaluations === "function") {
      clearEvaluations();
    }
  });

  test("returns no decision when no evaluations exist", async () => {
    const result = await orchestrateOptimization();
    expect(result.decision).toBeNull();
    expect(result.summary).toMatch(/No evaluations available/);
  });

  test("produces a decision and audit with seeded evaluations", async () => {
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
        qualityScore: 0.8,
        latencyMs: 600,
        cost: 0.0018,
        safetyIncident: false,
        timestamp: Date.now(),
      },
    ]);

    const result = await orchestrateOptimization();

    expect(result.decision).not.toBeNull();
    expect(result.decision.primaryModelId).toBeDefined();
    expect(result.audit).toBeDefined();
    expect(result.audit.scoredCandidates.length).toBeGreaterThan(0);
  });

  test("handles case where all candidates violate policy", async () => {
    seedMockEvaluations([
      {
        modelId: "unsafeExpensive",
        taskType: "general",
        qualityScore: 0.9,
        latencyMs: 2000,
        cost: 0.02,
        safetyIncident: true,
        timestamp: Date.now(),
      },
    ]);

    const result = await orchestrateOptimization();

    expect(result.decision).toBeNull();
    expect(result.summary).toMatch(/violated policy constraints/);
    expect(result.audit.policyViolations.length).toBeGreaterThan(0);
  });
});