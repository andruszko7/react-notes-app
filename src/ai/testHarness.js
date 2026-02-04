import { callAIStream } from "./aiClient.js";

export async function runCP503TestHarness() {
  console.log("=== CP‑503 TEST HARNESS START ===");

  const result = await callAIStream({
    prompt: "Write a short note about productivity.",
    noteContent: "",
    onToken: (t) => console.log("[STREAM]", t),
    modelId: "default"
  });

  console.log("=== CP‑503 RESPONSE ===");
  console.log(JSON.stringify(result, null, 2));

  console.log("=== CP‑503 TEST HARNESS END ===");
}