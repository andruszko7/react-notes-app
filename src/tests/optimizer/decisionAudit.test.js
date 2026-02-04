// /src/tests/optimizer/decisionAudit.test.js

const { buildDecisionAudit } = require("../../services/optimizer/decisionAudit");

describe("D39 Decision Audit & Traceability", () => {
  test("builds a complete audit record with all fields", () => {
    const audit = buildDecisionAudit({
      evaluations: [{ modelId: "A" }],
      policyViolations: [{ modelId: "B", violations: ["safety_incident"] }],
      tuningWeights: { quality: 0.5, latency: 0.2, cost: 0.2, safety: 0.1 },
      scoredCandidates: [{ modelId: "A", score: 0.9 }],
      bestModel: { modelId: "A", score: 0.9 },
      ensemble: [{ modelId: "A", score: 0.9 }],
      regressions: ["quality"],
    });

    expect(audit.evaluations.length).toBe(1);
    expect(audit.policyViolations.length).toBe(1);
    expect(audit.bestModel.modelId).toBe("A");
    expect(audit.ensemble.length).toBe(1);
    expect(audit.rationale.hasRegressions).toBe(true);
    expect(audit.rationale.selectionStrategy).toBe("ensemble");
  });

  test("fills defaults when optional fields are missing", () => {
    const audit = buildDecisionAudit({});
    expect(audit.evaluations).toEqual([]);
    expect(audit.policyViolations).toEqual([]);
    expect(audit.scoredCandidates).toEqual([]);
    expect(audit.bestModel).toBeNull();
    expect(audit.ensemble).toEqual([]);
    expect(audit.regressions).toEqual([]);
  });
});