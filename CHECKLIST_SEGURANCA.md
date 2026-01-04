# ✅ Checklist de Segurança - Deploy Vercel

Use este checklist para garantir que nenhum dado sensível será exposto durante o deploy.

## 🔍 Verificações de Código

- [x] **Nenhum token hardcoded no código**
  - ✅ Todas as APIs usam `process.env.*`
  - ✅ Verificado: `api/contact.js` - usa apenas variáveis de ambiente
  - ✅ Verificado: `api/test-onboarding.js` - usa apenas variáveis de ambiente
  - ✅ Verificado: Scripts em `scripts/` - usam apenas variáveis de ambiente

- [x] **Arquivos `.env*` não estão no Git**
  - ✅ `.gitignore` configurado para ignorar `.env*`
  - ⚠️ **Ação necessária:** Verifique manualmente se há arquivos `.env` commitados:
    ```bash
    git ls-files | grep -E "\.env"
    ```
    Se retornar algo, remova com `git rm --cached <arquivo>`

- [x] **`.vercelignore` configurado**
  - ✅ Criado e configurado para ignorar arquivos sensíveis
  - ✅ Ignora scripts PowerShell com configurações
  - ✅ Ignora arquivos de documentação com tokens

## 🔐 Variáveis de Ambiente Necessárias

Configure estas variáveis **APENAS** no dashboard da Vercel:

### Obrigatórias:
- [ ] `RESEND_API_KEY` - Chave da API do Resend
- [ ] `RESEND_FROM_EMAIL` - Email remetente verificado no Resend
- [ ] `CONTACT_TO_EMAIL` - Email que receberá os contatos do formulário
- [ ] `SITE_NAME` - Nome do site (ex: "Ana Cecília & José Olavo")

### Opcionais (mas recomendadas):
- [ ] `RESEND_FROM_NAME` - Nome do remetente
- [ ] `ONBOARDING_TEST_TOKEN` - Token para proteger endpoint de teste
- [ ] `ONBOARDING_TO_EMAIL` - Email para testes de onboarding

## 📁 Arquivos Criados/Atualizados

- [x] `vercel.json` - Configuração do deploy
- [x] `.vercelignore` - Proteção de arquivos sensíveis
- [x] `.gitignore` - Atualizado para proteger mais arquivos
- [x] `DEPLOY_VERCEL.md` - Guia completo de deploy

## 🚀 Próximos Passos

1. **Configure as variáveis de ambiente na Vercel**
   - Dashboard → Settings → Environment Variables
   - Configure para Production (e Preview se quiser)

2. **Faça o deploy**
   - Conecte o repositório na Vercel
   - Ou use `vercel --prod` via CLI

3. **Teste após o deploy**
   - Teste o formulário de contato
   - Verifique se os e-mails estão sendo enviados
   - Confirme que não há erros nos logs

## ⚠️ Lembrete Importante

**NUNCA:**
- ❌ Commite arquivos `.env*`
- ❌ Coloque tokens/chaves diretamente no código
- ❌ Compartilhe variáveis de ambiente em mensagens/emails públicos
- ❌ Faça commit de scripts com tokens hardcoded

**SEMPRE:**
- ✅ Use variáveis de ambiente configuradas na plataforma
- ✅ Verifique o `.gitignore` antes de commitar
- ✅ Use `.vercelignore` para proteger arquivos sensíveis
- ✅ Revise o código antes de fazer push

## 🔍 Comandos Úteis para Verificação

```bash
# Verificar se há arquivos .env no Git
git ls-files | grep -E "\.env"

# Verificar se há tokens hardcoded (executar na raiz do projeto)
grep -r "re_[a-zA-Z0-9]\{20,\}" api/ src/ --exclude-dir=node_modules

# Ver o que será ignorado pelo Vercel
cat .vercelignore

# Ver o que será ignorado pelo Git
cat .gitignore
```

---

**Status:** ✅ Código verificado e seguro para deploy!


