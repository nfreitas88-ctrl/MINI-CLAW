# Mini-Claw 🤖

Agente autónomo simplificado inspirado no OpenClaw, desenhado para correr em ambiente Node.js (inclusive Termux no Android) com integração direta com Telegram.

## Estrutura
- `index.js`: Ponto de entrada e bot Telegram.
- `agent.js`: Núcleo do agente que decide ações usando Gemini.
- `tools/web.js`: Ferramenta para pesquisas/acesso web simples.
- `tools/file.js`: Ferramenta para ler/gravar ficheiros locais.
- `memory.json`: Histórico de conversas.

## Instalação (Termux ou PC)

1. **Instalar dependências**:
```bash
npm install node-telegram-bot-api axios @google/genai dotenv
```

2. **Configuração & Onboarding**:
Execute o script interativo para configurar o seu agente:
```bash
node setup.js
```
Este script irá perguntar se deseja usar **Gemini (Cloud)** ou **Ollama (Local)** e pedirá as chaves necessárias.

3. **Executar**:
```bash
node index.js
```

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
