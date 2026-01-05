# Guia de Deploy na Vercel

Este guia explica como fazer o deploy deste projeto na Vercel de forma segura, garantindo que nenhum dado sensível seja exposto.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Projeto conectado ao GitHub/GitLab/Bitbucket (recomendado) ou pode fazer deploy manual
3. Chave da API do Resend configurada

## 🚀 Passo a Passo do Deploy

### 1. Preparar o Repositório

Certifique-se de que:
- ✅ Todos os arquivos `.env*` estão no `.gitignore`
- ✅ Nenhum token ou chave de API está hardcoded no código
- ✅ O arquivo `vercel.json` está na raiz do projeto

### 2. Conectar o Projeto na Vercel

#### Opção A: Via Dashboard da Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe seu repositório do GitHub/GitLab/Bitbucket
4. A Vercel detectará automaticamente que é um projeto Vite

#### Opção B: Via CLI da Vercel

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy (primeira vez)
vercel

# Deploy em produção
vercel --prod
```

### 3. Configurar Variáveis de Ambiente

**⚠️ CRÍTICO: Configure todas as variáveis de ambiente na Vercel antes do deploy!**

1. No dashboard da Vercel, vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ⚠️ IMPORTANTE: O domínio resend.dev só permite enviar para SEU PRÓPRIO e-mail!
# Para enviar para outros destinatários, você DEVE configurar um domínio verificado.
# Acesse: https://resend.com/domains e configure seu domínio antes do deploy!
#
# Para PRODUÇÃO (obrigatório usar domínio verificado):
RESEND_FROM_EMAIL=contato@anaceciliabatista.adv.br

CONTACT_TO_EMAIL=contato@anaceciliabatista.adv.br
SITE_NAME=Ana Cecília & José Olavo
```

#### Variáveis Opcionais (mas recomendadas)

```env
RESEND_FROM_NAME=Ana Cecília & José Olavo
ONBOARDING_TEST_TOKEN=um-token-grande-e-aleatorio-aqui
ONBOARDING_TO_EMAIL=seu-email@exemplo.com
```

**Importante:**
- Configure para **Production**, **Preview** e **Development** (ou apenas Production se preferir)
- **OBRIGATÓRIO:** Use um email de domínio verificado no Resend para produção (não use `resend.dev`)
- Siga o guia: https://resend.com/docs/dashboard/domains/introduction
- O `ONBOARDING_TEST_TOKEN` deve ser uma string longa e aleatória (ex: use `openssl rand -hex 32`)

### 4. Configurações do Projeto na Vercel

No dashboard da Vercel, em **Settings** → **General**:

- **Framework Preset:** Vite
- **Build Command:** `npm run build` (já configurado no `vercel.json`)
- **Output Directory:** `dist` (já configurado no `vercel.json`)
- **Install Command:** `npm install` (padrão)

### 5. Fazer o Deploy

1. Se conectou via GitHub/GitLab, faça push para a branch principal
2. A Vercel fará deploy automaticamente
3. Ou clique em **"Deploy"** no dashboard

### 6. Verificar o Deploy

Após o deploy:

1. ✅ Teste o formulário de contato em produção
2. ✅ Verifique se os e-mails estão sendo enviados
3. ✅ Confirme que não há erros no console da Vercel

## 🔒 Segurança - Garantindo que Nada Está Exposto

### Checklist de Segurança

- [ ] **Nenhum arquivo `.env*` está no repositório Git**
  ```bash
  # Verificar se há arquivos .env no Git
  git ls-files | grep -E "\.env"
  ```

- [ ] **Nenhuma chave de API está hardcoded no código**
  - Verifique `api/contact.js` e `api/test-onboarding.js`
  - Todas devem usar `process.env.*`

- [ ] **Arquivos sensíveis estão no `.gitignore`**
  - `.env*`
  - Scripts PowerShell com configurações
  - Arquivos de documentação com tokens

- [ ] **Variáveis de ambiente configuradas apenas na Vercel**
  - Não configure no código
  - Não commite arquivos `.env`

- [ ] **`.vercelignore` está configurado**
  - Garante que arquivos sensíveis não sejam enviados para a Vercel

### Verificações Adicionais

#### Verificar se há tokens expostos no código:

```bash
# Procurar por padrões suspeitos
grep -r "re_[a-zA-Z0-9]" --exclude-dir=node_modules .
grep -r "AIzaSy" --exclude-dir=node_modules .
grep -r "sk-" --exclude-dir=node_modules .
```

#### Verificar o que será enviado para a Vercel:

```bash
# Ver o que está sendo ignorado
cat .vercelignore
```

## 📁 Estrutura de Arquivos Importantes

```
.
├── vercel.json          # Configuração do deploy
├── .vercelignore        # Arquivos que NÃO serão enviados
├── .gitignore          # Arquivos que NÃO vão para o Git
├── api/                # Funções serverless (serão deployadas)
│   ├── contact.js
│   └── test-onboarding.js
└── src/                # Código React (será buildado)
```

## 🐛 Troubleshooting

### Erro: "RESEND_API_KEY não configurada"

- Verifique se a variável está configurada na Vercel
- Certifique-se de que está configurada para o ambiente correto (Production/Preview)
- Faça um novo deploy após adicionar variáveis

### Erro: "Function not found" ou 404 nas rotas `/api/*`

- Verifique se o `vercel.json` está na raiz do projeto
- Confirme que as funções estão em `api/`
- Verifique os logs da Vercel para mais detalhes

### E-mails não estão sendo enviados

- Verifique se o `RESEND_FROM_EMAIL` está verificado no Resend
- Confirme que o `RESEND_API_KEY` está correto
- Verifique os logs da função na Vercel

### Build falha

- Verifique se todas as dependências estão no `package.json`
- Confirme que o Node.js versão está compatível (Vercel usa Node 20.x por padrão)
- Veja os logs de build na Vercel

## 🔄 Atualizações Futuras

Para atualizar o site:

1. Faça as alterações no código
2. Commit e push para o repositório
3. A Vercel fará deploy automático (se configurado)
4. Ou faça deploy manual via dashboard/CLI

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Vercel + Vite](https://vercel.com/docs/frameworks/vite)
- [Serverless Functions na Vercel](https://vercel.com/docs/functions)
- [Environment Variables na Vercel](https://vercel.com/docs/projects/environment-variables)

## ✅ Checklist Final Antes do Deploy

- [ ] Todas as variáveis de ambiente configuradas na Vercel
- [ ] Nenhum arquivo `.env*` no repositório
- [ ] `vercel.json` configurado corretamente
- [ ] `.vercelignore` criado e configurado
- [ ] `.gitignore` atualizado
- [ ] Código testado localmente
- [ ] Build funciona localmente (`npm run build`)
- [ ] Formulário de contato testado localmente

---

**⚠️ Lembre-se:** Nunca commite arquivos `.env` ou tokens no código. Sempre use variáveis de ambiente configuradas na plataforma de deploy!


