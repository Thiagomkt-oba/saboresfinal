# Sabores de Minas - E-commerce

E-commerce completo para venda de manteigas artesanais com integração PIX via For4Payments.

## Deploy no Vercel

### Configuração Automática
Este projeto está otimizado para deploy no Vercel com zero configuração.

### Passos para Deploy
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente:
   - `FOR4PAYMENTS_API_KEY` - Chave da API For4Payments
   - `UTMIFY_API_TOKEN` - Token da API Utmify
3. Deploy automático

### APIs Disponíveis
- `/api/create-pix-payment` - Gera pagamentos PIX
- `/api/webhook-for4payments` - Webhook para confirmações
- `/api/setup-for4payments-webhook` - Configura webhook automaticamente
- `/api/test-for4payments` - Testa conectividade

### Tecnologias
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- For4Payments (PIX)
- Utmify (Analytics)
- Vercel Functions

### Funcionalidades
- Carrinho de compras
- Checkout completo
- Pagamento PIX
- Webhook automático
- Design responsivo
- Validação de CEP