// /src/tests/optimizer/scoringEngine.test.js

const {
  computeScore,
  computePolicyAwareScore,
} = require("../../services/optimizer/scoringEngine");

describe("D33 Multi-Objective Scoring Engine (base)", () => {
  test("computes score for high-quality, low-latency, safe model", () => {
    const score = computeScore({
      qualityScore: 0.95,
      latencyMs: 400,
      cost: 0.001,
      safetyIncident: false,
    });
    expect(score).toBeGreaterThan(0.8);
  });

  test("penalizes unsafe models", () => {
    const score = computeScore({
      qualityScore: 0.95,
      latencyMs: 400,
      cost: 0.001,
      safetyIncident: true,
    });
    expect(score).toBeLessThan(0.7);
  });
});

describe("D37 Policy-Aware Hybrid Scoring", () => {
  const baseInput = {
    qualityScore: 0.9,
    latencyMs: 500,
    cost: 0.002,
    safetyIncident: false,
  };

  const weights = {
    quality: 0.4,
    latency: 0.2,
    cost: 0.2,
    safety: 0.2,
  };

  test("matches base scoring when no policy context is given", () => {
    const base = computeScore(baseInput);
    const hybrid = computePolicyAwareScore(baseInput, weights);
    expect(hybrid).toBeCloseTo(base, 4);
  });

  test("hard-penalizes disallowed candidates", () => {
    const base = computeScore(baseInput);
    const hybrid = computePolicyAwareScore(baseInput, weights, {
      allowed: false,
      violations: ["safety_incident"],
    });
    expect(hybrid).toBeLessThan(base * 0.2);
  });

  test("soft-penalizes allowed candidates with violations", () => {
    const base = computeScore(baseInput);
    const hybrid = computePolicyAwareScore(baseInput, weights, {
      allowed: true,
      violations: ["cost_exceeds_max"],
    });
    expect(hybrid).toBeLessThan(base);
    expect(hybrid).toBeGreaterThan(base * 0.5);
  });
});