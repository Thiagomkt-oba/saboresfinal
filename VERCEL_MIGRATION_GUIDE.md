# Migração para Vercel - Guia Completo

## Arquivos Migrados

### APIs (pasta `api/`)
- `create-pix-payment.js` - Gera pagamentos PIX
- `webhook-for4payments.js` - Recebe notificações For4Payments  
- `setup-for4payments-webhook.js` - Configura webhook automaticamente
- `test-for4payments.js` - Testa conectividade da API

### Configuração
- `vercel.json` - Configuração de build e functions
- `README.md` - Documentação atualizada

### Removidos
- `netlify/` - Pasta de functions Netlify
- `netlify-deploy/` - Pasta de deploy Netlify
- `netlify.toml` - Configuração Netlify
- `vite.config.netlify.ts` - Config específico Netlify
- Arquivos de documentação Netlify

## Deploy no Vercel

### 1. Conectar Repositório
1. Acesse vercel.com
2. Login com GitHub
3. "New Project" → Selecione seu repositório
4. Deploy automático

### 2. Configurar Variáveis de Ambiente
No painel Vercel → Settings → Environment Variables:
- `FOR4PAYMENTS_API_KEY` - Sua chave For4Payments
- `UTMIFY_API_TOKEN` - Seu token Utmify

### 3. URLs das APIs
Após deploy, suas APIs estarão disponíveis em:
- `https://seu-projeto.vercel.app/api/create-pix-payment`
- `https://seu-projeto.vercel.app/api/webhook-for4payments`
- `https://seu-projeto.vercel.app/api/setup-for4payments-webhook`
- `https://seu-projeto.vercel.app/api/test-for4payments`

### 4. Configurar Webhook For4Payments
Execute: `POST https://seu-projeto.vercel.app/api/setup-for4payments-webhook`

## Vantagens da Migração

- Deploy mais rápido
- Functions mais estáveis
- Melhor integração com React
- Zero configuração necessária
- Logs mais detalhados

Projeto pronto para produção no Vercel.