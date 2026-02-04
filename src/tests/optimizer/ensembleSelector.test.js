// /src/tests/optimizer/ensembleSelector.test.js

const { selectEnsemble } = require("../../services/optimizer/ensembleSelector");

describe("D38 Multi-Model Ensemble Selection", () => {
  test("returns null and empty array for no candidates", () => {
    const { best, ensemble } = selectEnsemble([]);
    expect(best).toBeNull();
    expect(ensemble).toEqual([]);
  });

  test("selects best and ensemble of top-k models", () => {
    const candidates = [
      { modelId: "A", score: 0.8 },
      { modelId: "B", score: 0.9 },
      { modelId: "C", score: 0.85 },
      { modelId: "D", score: 0.7 },
    ];

    const { best, ensemble } = selectEnsemble(candidates, 3);

    expect(best.modelId).toBe("B");
    const ensembleIds = ensemble.map((c) => c.modelId);
    expect(ensembleIds).toEqual(["B", "C", "A"]);
  });

  test("handles topK larger than candidate list", () => {
    const candidates = [
      { modelId: "A", score: 0.8 },
      { modelId: "B", score: 0.9 },
    ];

    const { ensemble } = selectEnsemble(candidates, 5);
    expect(ensemble.length).toBe(2);
  });
});