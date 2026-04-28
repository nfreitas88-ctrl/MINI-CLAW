const fs = require("fs");
const path = require("path");

module.exports = async function file(filename, content) {
  try {
    const safePath = path.join(process.cwd(), filename);
    
    if (content !== undefined && content !== null) {
      // Gravação
      fs.writeFileSync(safePath, content);
      return `Ficheiro '${filename}' guardado com sucesso.`;
    } else {
      // Leitura
      if (!fs.existsSync(safePath)) return `Erro: Ficheiro '${filename}' não existe.`;
      const data = fs.readFileSync(safePath, 'utf8');
      return data.slice(0, 500);
    }
  } catch (e) {
    return `Erro no sistema de ficheiros: ${e.message}`;
  }
};
