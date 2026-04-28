const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

/**
 * Decide qual modelo chamar baseado na config
 */
async function callModel(prompt, config) {
  if (config.mode === "local") {
    return await callOllama(prompt, config);
  } else {
    return await callCloud(prompt, config);
  }
}

// LOCAL (Ollama)
async function callOllama(prompt, config) {
  const host = config.ollamaHost || "http://localhost:11434";
  const model = config.localModel || config.model || "gemma";
  
  try {
    const res = await axios.post(`${host}/api/generate`, {
      model: model,
      prompt,
      stream: false,
    }, { timeout: 60000 });

    return res.data.response;
  } catch (e) {
    console.error(`[Router] Ollama falhou em ${host}:`, e.message);
    if (config.allowFallback) {
        console.warn("[Router] Tentando fallback para Cloud...");
        return await callCloud(prompt, config);
    }
    throw new Error(`Ollama falhou: ${e.message}`);
  }
}

// CLOUD (Gemini)
async function callCloud(prompt, config) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return JSON.stringify({ action: "response", output: "Erro: GEMINI_API_KEY ausente." });

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.getGenerativeModel({ model: config.cloudModel || "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("[Router] Gemini falhou:", e.message);
    throw new Error(`Cloud LLM falhou: ${e.message}`);
  }
}

module.exports = { callModel };
