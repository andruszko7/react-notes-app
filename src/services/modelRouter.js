// CP‑503 MODEL ROUTER — S7‑D1

export const CP503_MODELS = [
  {
    id: "local-ollama",
    label: "Local — Ollama (Llama 3.2)",
    provider: "ollama",
    modelName: "llama3.2",
    supportsStreaming: true
  },
  {
    id: "openai-gpt4",
    label: "Cloud — OpenAI GPT‑4 (placeholder)",
    provider: "openai",
    modelName: "gpt-4.1-mini",
    supportsStreaming: false
  },
  {
    id: "gemini-pro",
    label: "Cloud — Gemini Pro (placeholder)",
    provider: "gemini",
    modelName: "gemini-pro",
    supportsStreaming: false
  }
];

export function getDefaultModelId() {
  return "local-ollama";
}

export function getAllModels() {
  return CP503_MODELS;
}

export function getModelConfig(modelId) {
  const model = CP503_MODELS.find((m) => m.id === modelId) 
    || CP503_MODELS[0];

  switch (model.provider) {
    case "ollama":
      return {
        ...model,
        apiUrl: "http://localhost:11434/api/generate",
        mode: "jsonl-stream"
      };

    case "openai":
      return {
        ...model,
        apiUrl: "https://api.openai.com/v1/chat/completions",
        mode: "json"
      };

    case "gemini":
      return {
        ...model,
        apiUrl: "https://generativelanguage.googleapis.com/v1beta/models",
        mode: "json"
      };

    default:
      throw new Error(`Unknown provider: ${model.provider}`);
  }
}