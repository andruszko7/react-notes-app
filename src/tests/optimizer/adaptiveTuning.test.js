// /src/tests/optimizer/adaptiveTuning.test.js

const { adaptiveTuning } = require("../../services/optimizer/adaptiveTuning");

describe("D35 Adaptive Tuning Engine", () => {
  test("returns default weights when insufficient history", () => {
    const weights = adaptiveTuning([{ qualityScore: 0.9 }]);
    expect(weights).toEqual({
      quality: 0.4,
      latency: 0.2,
      cost: 0.2,
      safety: 0.2,
    });
  });

  test("increases quality weight when quality regresses", () => {
    const history = [
      { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false },
      { qualityScore: 0.7, latencyMs: 800, cost: 0.002, safetyIncident: false },
    ];
    const weights = adaptiveTuning(history);
    expect(weights.quality).toBeGreaterThan(0.4);
  });

  test("increases latency weight when latency worsens", () => {
    const history = [
      { qualityScore: 0.9, latencyMs: 700, cost: 0.002, safetyIncident: false },
      { qualityScore: 0.9, latencyMs: 950, cost: 0.002, safetyIncident: false },
    ];
    const weights = adaptiveTuning(history);
    expect(weights.latency).toBeGreaterThan(0.2);
  });

  test("increases cost weight when cost rises", () => {
    const history = [
      { qualityScore: 0.9, latencyMs: 800, cost: 0.0015, safetyIncident: false },
      { qualityScore: 0.9, latencyMs: 800, cost: 0.003, safetyIncident: false },
    ];
    const weights = adaptiveTuning(history);
    expect(weights.cost).toBeGreaterThan(0.2);
  });

  test("increases safety weight when a new safety incident appears", () => {
    const history = [
      { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false },
      { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: true },
    ];
    const weights = adaptiveTuning(history);
    expect(weights.safety).toBeGreaterThan(0.2);
  });

  test("weights always normalize to sum to 1", () => {
    const history = [
      { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false },
      { qualityScore: 0.7, latencyMs: 900, cost: 0.003, safetyIncident: true },
    ];
    const weights = adaptiveTuning(history);
    const total =
      weights.quality + weights.latency + weights.cost + weights.safety;
    expect(total).toBeCloseTo(1, 5);
  });
});