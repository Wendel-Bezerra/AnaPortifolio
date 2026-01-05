# 🚨 Erro 403 com Resend - Guia de Solução

## ❌ O Problema

Se você está recebendo um **erro 403** ao tentar enviar e-mails via Resend, provavelmente é porque:

1. Você está usando `onboarding@resend.dev` como remetente
2. Está tentando enviar e-mails para **outros destinatários** (não apenas para você mesmo)

### Por que isso acontece?

O domínio `resend.dev` é um **domínio de teste** fornecido pelo Resend com uma **restrição de segurança importante**:

> ⚠️ **Você só pode enviar e-mails para o endereço de e-mail cadastrado na sua conta Resend.**

Se tentar enviar para qualquer outro destinatário, você receberá um **erro 403 (Forbidden)**.

**Fonte oficial:** https://resend.com/docs/knowledge-base/403-error-resend-dev-domain

---

## ✅ A Solução

Para enviar e-mails para **qualquer destinatário**, você precisa:

1. **Adicionar e verificar seu próprio domínio** no Resend
2. **Atualizar a variável de ambiente** `RESEND_FROM_EMAIL`

---

## 📋 Passo a Passo Completo

### 1️⃣ Adicionar seu domínio no Resend

1. Acesse: https://resend.com/domains
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `anaceciliabatista.adv.br`)
4. Clique em **"Add"**

### 2️⃣ Configurar os registros DNS

O Resend fornecerá registros DNS que você precisa adicionar no seu provedor de domínio (ex: Registro.br, GoDaddy, Cloudflare, etc.).

**Você precisará adicionar:**

- **SPF** (TXT record)
- **DKIM** (TXT record)
- **DMARC** (TXT record) - opcional, mas recomendado

**Exemplo de registros:**

```
Tipo: TXT
Nome: @
Valor: v=spf1 include:_spf.resend.com ~all

Tipo: TXT
Nome: resend._domainkey
Valor: [valor fornecido pelo Resend]
```

### 3️⃣ Aguardar a verificação

Após adicionar os registros DNS:

1. Aguarde alguns minutos (pode levar até 48h em casos raros)
2. Volte ao dashboard do Resend
3. Clique em **"Verify"** ao lado do seu domínio
4. Quando verificado, aparecerá um ✅ verde

### 4️⃣ Atualizar suas variáveis de ambiente

#### No arquivo `.env` local:

```env
# ❌ ANTES (só funciona para seu próprio e-mail)
RESEND_FROM_EMAIL=onboarding@resend.dev

# ✅ DEPOIS (funciona para qualquer destinatário)
RESEND_FROM_EMAIL=contato@anaceciliabatista.adv.br
```

Você pode usar qualquer e-mail do seu domínio verificado:
- `contato@anaceciliabatista.adv.br`
- `noreply@anaceciliabatista.adv.br`
- `sistema@anaceciliabatista.adv.br`
- `ola@anaceciliabatista.adv.br`

#### Na Vercel (se já fez deploy):

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Encontre `RESEND_FROM_EMAIL`
5. Clique em **Edit**
6. Altere para: `contato@anaceciliabatista.adv.br` (ou outro e-mail do seu domínio)
7. Clique em **Save**
8. Faça um **novo deploy** para aplicar as mudanças

---

## 🔍 Onde o código precisa ser alterado?

**Boa notícia:** Você **NÃO precisa alterar nenhum código!** 🎉

Seu código já está preparado para usar a variável de ambiente `RESEND_FROM_EMAIL`:

### Arquivos que usam a variável (já estão corretos):

1. **`api/contact.js`** (linha 64):
   ```javascript
   const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
   ```

2. **`api/test-onboarding.js`** (linha 40):
   ```javascript
   const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
   ```

3. **`scripts/send-onboarding.mjs`** (linha 18):
   ```javascript
   const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
   ```

**O que fazer:**
- ✅ Apenas configure a variável de ambiente `RESEND_FROM_EMAIL` com seu domínio verificado
- ✅ O código automaticamente usará o novo valor
- ✅ O fallback `onboarding@resend.dev` só será usado se a variável não estiver definida

---

## 🧪 Testando a Solução

### Teste 1: Localmente

1. Atualize seu `.env`:
   ```env
   RESEND_FROM_EMAIL=contato@anaceciliabatista.adv.br
   ```

2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Envie um e-mail de teste pelo formulário de contato

4. Verifique se o e-mail foi enviado com sucesso

### Teste 2: Na Vercel (produção)

1. Atualize a variável de ambiente na Vercel
2. Faça um novo deploy
3. Teste o formulário em produção
4. Verifique os logs na Vercel: **Deployments** → **Functions** → **contact**

---

## 🐛 Troubleshooting

### Ainda recebendo erro 403?

**Verifique:**
1. ✅ O domínio está **verificado** no Resend (ícone verde ✅)
2. ✅ A variável `RESEND_FROM_EMAIL` está usando o domínio verificado
3. ✅ Você fez um novo deploy após alterar a variável (na Vercel)
4. ✅ O e-mail no `from` corresponde ao domínio verificado

### Domínio não verifica?

**Possíveis causas:**
- Os registros DNS ainda não propagaram (aguarde até 48h)
- Os registros DNS foram adicionados incorretamente
- Você está usando um subdomínio não verificado

**Solução:**
1. Use uma ferramenta de verificação DNS: https://mxtoolbox.com/SuperTool.aspx
2. Verifique se os registros TXT estão corretos
3. Aguarde mais tempo para propagação
4. Entre em contato com o suporte do Resend: https://resend.com/help

### E-mails caindo no spam?

**Dicas:**
1. Configure o registro **DMARC** (recomendado)
2. Use um e-mail profissional como remetente (ex: `contato@`, não `noreply@`)
3. Configure o `RESEND_FROM_NAME` para um nome reconhecível
4. Evite palavras como "teste", "grátis", "promoção" no assunto

---

## 📚 Recursos Úteis

- **Documentação oficial do erro 403:** https://resend.com/docs/knowledge-base/403-error-resend-dev-domain
- **Guia de verificação de domínio:** https://resend.com/docs/dashboard/domains/introduction
- **Dashboard de domínios:** https://resend.com/domains
- **Suporte do Resend:** https://resend.com/help

---

## ✅ Checklist Final

Antes de considerar o problema resolvido:

- [ ] Domínio adicionado no Resend
- [ ] Registros DNS configurados no provedor de domínio
- [ ] Domínio verificado (✅ verde no dashboard)
- [ ] Variável `RESEND_FROM_EMAIL` atualizada no `.env` local
- [ ] Variável `RESEND_FROM_EMAIL` atualizada na Vercel
- [ ] Novo deploy feito na Vercel
- [ ] Teste de envio de e-mail realizado com sucesso
- [ ] E-mail recebido pelo destinatário (não caiu no spam)

---

**🎉 Pronto! Agora você pode enviar e-mails para qualquer destinatário sem erro 403!**
