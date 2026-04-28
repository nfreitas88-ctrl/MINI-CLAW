const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const configPath = path.join(__dirname, 'config.json');
const envPath = path.join(__dirname, '..', '.env');

console.log(`
=========================================
      MINI-CLAW SETUP & ONBOARDING
=========================================
Benvindo ao setup do seu agente autónomo.
`);

const config = {
  provider: 'gemini', // 'gemini' ou 'ollama'
  ollamaModel: 'llama3',
  geminiModel: 'gemini-1.5-flash'
};

async function startSetup() {
  // 1. Escolha de Provedor
  console.log("Escolha o backend de Inteligência Artificial:");
  console.log("1. Gemini (Cloud - Rápido, requer API Key)");
  console.log("2. Ollama (Local - Requer Ollama instalado no Termux)");
  
  const choice = await ask("Opção (1 ou 2): ");
  config.provider = choice === '2' ? 'ollama' : 'gemini';

  let geminiKey = "";
  let ollamaHost = "http://localhost:11434";

  if (config.provider === 'gemini') {
    geminiKey = await ask("Introduza a sua Google AI Gemini API Key: ");
    config.geminiModel = await ask("Modelo Gemini [gemini-1.5-flash]: ") || 'gemini-1.5-flash';
  } else {
    ollamaHost = await ask("Endpoint do Ollama [http://localhost:11434]: ") || 'http://localhost:11434';
    config.ollamaModel = await ask("Modelo Ollama [ex: llama3, mistral]: ") || 'llama3';
    config.ollamaHost = ollamaHost;
    console.log(`\nCertifique-se que o Ollama está a correr (${ollamaHost}) antes de iniciar.`);
  }

  // 2. Telegram
  const botToken = await ask("Introduza o seu Telegram Bot Token (@BotFather): ");
  const userId = await ask("Introduza o seu Telegram User ID (para segurança): ");

  // Salvar Config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // Salvar ENV
  const envContent = `GEMINI_API_KEY="${geminiKey}"
TELEGRAM_BOT_TOKEN="${botToken}"
TELEGRAM_USER_ID="${userId}"
LLM_PROVIDER="${config.provider}"
OLLAMA_HOST="${ollamaHost}"
OLLAMA_MODEL="${config.ollamaModel}"
GEMINI_MODEL="${config.geminiModel}"`;

  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Configuração concluída com sucesso!");
  console.log("Agora pode iniciar o agente com: node index.js");
  process.exit(0);
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

startSetup();
