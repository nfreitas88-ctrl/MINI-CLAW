const router = require("./router");

/**
 * Divide o objetivo em passos discretos
 */
async function planner(objective, memory, config) {
  const prompt = `
Tu és o PLATNER do Mini Claw OS.
A tua tarefa é dividir o objetivo do utilizador em passos lógicos e sequenciais.

CONTEXTO RECENTE:
${JSON.stringify(memory.history.slice(-3), null, 2)}

OBJETIVO:
${objective}

REGRAS:
- Responde APENAS em JSON válido.
- Mantém os passos curtos e focados em ação (ex: "Pesquisar novidades tech", "Gravar resumo num ficheiro").
- Máximo de 3 a 5 passos.

FORMATO DE RESPOSTA (JSON):
{
  "steps": ["passo 1", "passo 2", "passo 3"],
  "reasoning": "Breve explicação do porquê deste plano"
}
`;

  try {
    const raw = await router.callModel(prompt, { ...config, responseType: 'json' });
    // Limpeza de markdown code blocks se o modelo os incluir
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("[Planner] Erro ao gerar plano:", e.message);
    return { steps: [objective], reasoning: "Falha no planeamento, executando objetivo original diretamente." };
  }
}

module.exports = planner;
