const web = require("./web");
const file = require("./file");

const registry = {
  web,
  file,
};

/**
 * Orquestrador central de ferramentas
 */
async function run(toolName, input, content) {
  console.log(`[Registry] Running tool: ${toolName}`);
  
  if (!registry[toolName]) {
    return `Erro: Ferramenta '${toolName}' não registrada no Mini Claw OS.`;
  }

  try {
    return await registry[toolName](input, content);
  } catch (e) {
    return `Erro ao executar ${toolName}: ${e.message}`;
  }
}

module.exports = { run, registry };
