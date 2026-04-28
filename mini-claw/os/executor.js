const tools = require("../tools/registry");
const router = require("./router");
const fs = require("fs");
const path = require("path");

function getSoul() {
    const soulPath = path.join(__dirname, "..", "identity", "soul.md");
    if (fs.existsSync(soulPath)) return fs.readFileSync(soulPath, "utf-8");
    return "Tu és o Mini Claw OS, um agente técnico e eficiente.";
}

/**
 * Executa um passo específico recorrendo a ferramentas ou conhecimento
 */
async function executor(step, memory, config, mainObjective) {
  const prompt = `
SISTEMA:
${getSoul()}

OBJETIVO PRINCIPAL: ${mainObjective}
PASSO ATUAL: ${step}

REGRAS:
- Responde APENAS em JSON válido.
- Se precisares de informações externas (web) ou gerir ficheiros (file) -> usa "action": "tool".
- Se tiveres a resposta final para este passo -> usa "action": "response".

FORMATO JSON:
{
  "action": "tool" | "response",
  "tool": "web" | "file" | null,
  "input": "URL ou Nome do Ficheiro",
  "content": "Conteúdo para gravação (se tool for file)",
  "output": "A tua resposta se action for response",
  "reasoning": "O que estás a fazer e porquê?"
}
`;

  try {
    const raw = await router.callModel(prompt, { ...config, responseType: 'json' });
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const decision = JSON.parse(cleaned);

    if (decision.action === "tool") {
      console.log(`[Executor] Using tool ${decision.tool} for: ${decision.input}`);
      const toolOutput = await tools.run(decision.tool, decision.input, decision.content);
      
      // Segunda chamada para processar o output da tool
      const followUpPrompt = `
O utilizador queria: ${step}
A tool ${decision.tool} retornou: ${toolOutput}

Dá a resposta final baseada nisto.
Responde JSON com "action": "response" e o teu "output".
`;
      const finalRaw = await router.callModel(followUpPrompt, config);
      try {
          const finalCleaned = finalRaw.replace(/```json/g, '').replace(/```/g, '').trim();
          const finalDecision = JSON.parse(finalCleaned);
          return finalDecision.output || finalRaw;
      } catch {
          return finalRaw;
      }
    }

    return decision.output || decision.reasoning || raw;
  } catch (e) {
    console.error("[Executor] Erro na execução:", e.message);
    return `Erro na execução: ${e.message}`;
  }
}

module.exports = executor;
