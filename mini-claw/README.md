# Mini-Claw 🤖

Agente autónomo simplificado inspirado no OpenClaw, desenhado para correr em ambiente Node.js (inclusive Termux no Android) com integração direta com Telegram.

## Estrutura
- `index.js`: Ponto de entrada e bot Telegram.
- `agent.js`: Núcleo do agente que decide ações usando Gemini.
- `tools/web.js`: Ferramenta para pesquisas/acesso web simples.
- `tools/file.js`: Ferramenta para ler/gravar ficheiros locais.
- `memory.json`: Histórico de conversas.

## Instalação (Termux no Android)

Para quem quer usar o Mini-Claw no telemóvel com a melhor performance e segurança, siga estes passos no [Termux](https://termux.dev/):

1. **Atualizar o sistema e pacotes**:
   ```bash
   pkg update && pkg upgrade
   ```

2. **Instalar Node.js LTS (Versão 24 recomendada) e Git**:
   ```bash
   pkg install nodejs git
   ```
   *Nota: O Mini-Claw foi testado com Node.js v24.x para garantir compatibilidade e segurança.*

3. **Clonar o projeto**:
   ```bash
   git clone https://github.com/teu-usuario/mini-claw.git
   cd mini-claw
   ```

4. **Instalar as dependências e corrigir vulnerabilidades**:
   ```bash
   npm install
   npm audit fix --force
   ```
   *Isto garantirá que todos os módulos estão atualizados e sem falhas de segurança conhecidas.*

5. **Configuração Guiada**:
   ```bash
   node setup.js
   ```
   *Siga as instruções no ecrã para colocar o seu Token do Telegram e a sua chave Gemini (se usar Cloud).*

6. **Iniciar o Agente**:
   ```bash
   node index.js
   ```

## Instalação (PC/Servidor)
1. Certifique-se de que tem o **Node.js** instalado.
2. Clone o repositório e entre na pasta.
3. Corra `npm install`.
4. Corra `node setup.js` para configurar.
5. Inicie com `node index.js`.

## Como funciona
O agente recebe o teu objetivo via Telegram, "pensa" no que fazer e pode decidir:
1. Usar a Inteligência Artificial (Gemini ou Ollama Local).
2. Contactar a Web.
3. Ler/Escrever ficheiros.

## Uso com Ollama (Local)
Se escolher usar o Ollama no Termux:
1. Instale o Ollama no Termux.
2. Inicie o servidor: `ollama serve`
3. Baixe o modelo desejado: `ollama pull llama3`
4. No `setup.js`, selecione a opção de Provedor Local.

## Exemplo de uso
- "Cria um ficheiro chamado notas.txt com o texto 'olá mundo'"
- "Qual o preço atual da Bitcoin? (podes dar-lhe uma URL para ele ler)"
- "Guarda um resumo da página https://example.com num ficheiro"

## Troubleshooting & Dicas (FAQ)

- **O Agente não responde no Telegram?**
  - Verifique se o `TELEGRAM_BOT_TOKEN` e `TELEGRAM_USER_ID` estão corretos no ficheiro `.env`.
  - Pode descobrir o seu ID enviando uma mensagem para o bot `@userinfobot`.

- **Erro de "API Key" ou Gemini?**
  - Certifique-se de que a sua chave Gemini é válida e que o modelo está disponível (ex: `gemini-1.5-flash`).

- **Ollama está lento?**
  - O Ollama no Termux depende do processador do telemóvel. Use modelos pequenos como o `qwen2:0.5b` ou `tinyllama` para maior velocidade.

- **Como manter o bot ligado 24/7?**
  - No Termux, use o comando `termux-wake-lock` para evitar que o sistema suspenda o Node.js.
  - Alternativamente, use o `pm2` (`npm install -g pm2`) para gerir o processo.

---
*Criado com ❤️ pela equipa Mini Claw*
