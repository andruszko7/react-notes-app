// /src/tests/optimizer/regressionDetector.test.js

const { detectRegression } = require("../../services/optimizer/regressionDetector");

describe("D34 Regression Detection", () => {
  test("flags quality regression", () => {
    const previous = { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false };
    const current = { qualityScore: 0.7, latencyMs: 800, cost: 0.002, safetyIncident: false };
    const result = detectRegression(previous, current);
    expect(result.includes("quality")).toBe(true);
  });

  test("flags latency regression", () => {
    const previous = { qualityScore: 0.9, latencyMs: 700, cost: 0.002, safetyIncident: false };
    const current = { qualityScore: 0.9, latencyMs: 950, cost: 0.002, safetyIncident: false };
    const result = detectRegression(previous, current);
    expect(result.includes("latency")).toBe(true);
  });

  test("flags cost regression", () => {
    const previous = { qualityScore: 0.9, latencyMs: 800, cost: 0.0015, safetyIncident: false };
    const current = { qualityScore: 0.9, latencyMs: 800, cost: 0.003, safetyIncident: false };
    const result = detectRegression(previous, current);
    expect(result.includes("cost")).toBe(true);
  });

  test("flags safety regression", () => {
    const previous = { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false };
    const current = { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: true };
    const result = detectRegression(previous, current);
    expect(result.includes("safety")).toBe(true);
  });

  test("returns empty array when no regression", () => {
    const previous = { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false };
    const current = { qualityScore: 0.9, latencyMs: 800, cost: 0.002, safetyIncident: false };
    const result = detectRegression(previous, current);
    expect(result.length).toBe(0);
  });
});