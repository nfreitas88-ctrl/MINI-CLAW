require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { runOS } = require("./os/kernel");
const fs = require('fs');
const path = require('path');

const USER_ID = process.env.TELEGRAM_USER_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("ERRO: TELEGRAM_BOT_TOKEN não configurado.");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Carregar configuração base
const configPath = path.join(__dirname, 'config.json');
let baseConfig = { 
  mode: process.env.LLM_PROVIDER === "ollama" ? "local" : "cloud",
  localModel: process.env.OLLAMA_MODEL || "gemma",
  cloudModel: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
  ollamaHost: process.env.OLLAMA_HOST || "http://localhost:11434",
  allowFallback: true
};

if (fs.existsSync(configPath)) {
  try {
    const saved = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    baseConfig.mode = saved.provider === "ollama" ? "local" : "cloud";
    baseConfig.localModel = saved.ollamaModel || baseConfig.localModel;
    baseConfig.cloudModel = saved.geminiModel || baseConfig.cloudModel;
    baseConfig.ollamaHost = saved.ollamaHost || baseConfig.ollamaHost;
  } catch (e) {
    console.warn("Erro ao ler config.json, usando defaults do .env");
  }
}

console.log(`Mini-Claw OS v1 iniciado [Modo: ${baseConfig.mode}]`);

bot.on("message", async (msg) => {
  if (msg.from.id.toString() !== USER_ID) {
    console.warn(`Acesso bloqueado: ${msg.from.id}`);
    return;
  }

  const chatId = msg.chat.id;
  const objective = msg.text;

  bot.sendChatAction(chatId, "typing");
  
  try {
    const response = await runOS(objective, baseConfig);
    bot.sendMessage(chatId, response);
  } catch (error) {
    console.error("Erro no Kernel:", error.message);
    bot.sendMessage(chatId, `⚠️ Erro no Kernel: ${error.message}`);
  }
});
