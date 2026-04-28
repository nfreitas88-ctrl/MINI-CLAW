# Mini-Claw 🤖

Agente autónomo simplificado e otimizado para Termux e ambientes móveis.

## Requisitos
- Node.js v24.x (Recomendado)
- Git
- Token do Telegram (Opcional)

## Instalação no Termux

1. **Atualizar o sistema**:
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
   git clone <link-do-repositorio>
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
   npm run setup
   ```

6. **Iniciar o Agente**:
   ```bash
   npm start
   ```

## Segurança e Performance
Este projeto foi otimizado para resolver conflitos de dependências comuns em sistemas Android/Termux, utilizando as versões mais estáveis do ecossistema React e Node.js.
