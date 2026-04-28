const axios = require("axios");

module.exports = async function web(url) {
  try {
    if (!url) return "URL inválida";
    const res = await axios.get(url, { timeout: 5000 });
    const content = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    return content.slice(0, 1000);
  } catch (e) {
    return `Erro no request: ${e.message}`;
  }
};
