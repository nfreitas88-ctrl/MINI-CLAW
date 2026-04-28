const fs = require("fs");
const path = require("path");
const planner = require("./planner");
const executor = require("./executor");

const MEMORY_PATH = path.join(__dirname, "..", "memory", "memory.json");

function loadMemory() {
  if (!fs.existsSync(MEMORY_PATH)) {
    return {
      history: []
    };
  }
  try {
    return JSON.parse(fs.readFileSync(MEMORY_PATH, "utf-8"));
  } catch (e) {
    return { history: [] };
  }
}

function saveMemory(memory) {
  const dir = path.dirname(MEMORY_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

async function runOS(objective, config) {
  let memory = loadMemory();

  const plan = await planner(objective, memory, config);

  let finalResult = null;

  for (const step of plan.steps) {
    const result = await executor(step, memory, config, objective);

    memory.history.push({
      step,
      result,
    });

    finalResult = result;
  }

  saveMemory(memory);

  return finalResult;
}

module.exports = { runOS };
