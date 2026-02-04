// /src/tests/optimizer/policyEngine.test.js

const {
  evaluatePolicies,
  filterAllowedCandidates,
} = require("../../services/optimizer/policyEngine");

describe("D36 Policy Engine", () => {
  test("allows model that meets all policies", () => {
    const evalData = {
      qualityScore: 0.8,
      latencyMs: 800,
      cost: 0.002,
      safetyIncident: false,
    };

    const result = evaluatePolicies(evalData);

    expect(result.allowed).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  test("flags safety incident violation", () => {
    const evalData = {
      qualityScore: 0.9,
      latencyMs: 700,
      cost: 0.002,
      safetyIncident: true,
    };

    const result = evaluatePolicies(evalData);

    expect(result.allowed).toBe(false);
    expect(result.violations).toContain("safety_incident");
  });

  test("flags cost, latency, and quality violations together", () => {
    const evalData = {
      qualityScore: 0.5,
      latencyMs: 1500,
      cost: 0.006,
      safetyIncident: false,
    };

    const result = evaluatePolicies(evalData, {
      maxCost: 0.005,
      maxLatencyMs: 1200,
      minQualityScore: 0.6,
    });

    expect(result.allowed).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        "cost_exceeds_max",
        "latency_exceeds_max",
        "quality_below_min",
      ])
    );
  });

  test("respects custom relaxed safety policy", () => {
    const evalData = {
      qualityScore: 0.9,
      latencyMs: 700,
      cost: 0.002,
      safetyIncident: true,
    };

    const result = evaluatePolicies(evalData, {
      requireNoSafetyIncidents: false,
    });

    expect(result.allowed).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  test("filters allowed candidates from a list", () => {
    const candidates = [
      {
        modelId: "safeCheap",
        qualityScore: 0.8,
        latencyMs: 700,
        cost: 0.002,
        safetyIncident: false,
      },
      {
        modelId: "unsafe",
        qualityScore: 0.9,
        latencyMs: 600,
        cost: 0.002,
        safetyIncident: true,
      },
      {
        modelId: "expensiveSlow",
        qualityScore: 0.85,
        latencyMs: 1400,
        cost: 0.006,
        safetyIncident: false,
      },
    ];

    const allowed = filterAllowedCandidates(candidates, {
      maxCost: 0.005,
      maxLatencyMs: 1200,
      requireNoSafetyIncidents: true,
      minQualityScore: 0.6,
    });

    const allowedIds = allowed.map((c) => c.modelId);
    expect(allowedIds).toEqual(["safeCheap"]);
  });
});