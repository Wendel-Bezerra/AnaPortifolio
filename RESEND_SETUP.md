# Integração Resend (Formulário de Contato + Onboarding)

Este projeto é **Vite + React** (front-end estático). Para enviar e-mails via **Resend**, foi adicionada uma pasta `api/` com **funções serverless** (compatível com deploy na **Vercel**).

## Variáveis de ambiente necessárias

Configure estas variáveis no seu provedor de deploy (ex.: Vercel → Project Settings → Environment Variables) ou em um arquivo local `.env.local` (se você usar um runtime serverless local como `vercel dev`):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ⚠️ IMPORTANTE: O domínio resend.dev só permite enviar para SEU PRÓPRIO e-mail!
# Para enviar para outros destinatários, você DEVE configurar um domínio verificado.
# Acesse: https://resend.com/domains
# 
# Para TESTES (apenas para seu próprio e-mail):
# RESEND_FROM_EMAIL=onboarding@resend.dev
#
# Para PRODUÇÃO (obrigatório usar domínio verificado):
RESEND_FROM_EMAIL=contato@anaceciliabatista.adv.br

# Para onde vai o e-mail de aviso do formulário:
CONTACT_TO_EMAIL=contato@anaceciliabatista.adv.br

# Nome exibido nos assuntos/corpo:
SITE_NAME=Ana Cecília & José Olavo

# Protege o endpoint /api/test-onboarding
ONBOARDING_TEST_TOKEN=troque-por-um-token-grande
ONBOARDING_TO_EMAIL=seu-email@exemplo.com
```

## Endpoints adicionados

- `POST /api/contact`
  - Envia **1 e-mail de aviso** para `CONTACT_TO_EMAIL` (com `Reply-To` do visitante)
  - Envia **1 e-mail de sucesso** para o e-mail informado no formulário

- `POST /api/test-onboarding` (protegido por token)
  - Envia um **e-mail de onboarding (teste)** para `ONBOARDING_TO_EMAIL` ou para `to` no body
  - Requer header `X-Test-Token: <ONBOARDING_TEST_TOKEN>`

## Teste via script (sem endpoint)

Também existe:

- `scripts/send-onboarding.mjs`

Exemplo:

```bash
node scripts/send-onboarding.mjs --to seu-email@exemplo.com --name "Natanael"
```

## Testar o formulário localmente (Vite + /api)

Em modo desenvolvimento (`npm run dev`), o Vite agora expõe **`/api/contact`** e **`/api/test-onboarding`** via middleware, usando as funções em `api/`.

1) Crie/ajuste seu `.env` na raiz com pelo menos:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_TO_EMAIL=contato@anaceciliabatista.adv.br
SITE_NAME=Ana Cecília & José Olavo
```

2) Rode:

```bash
npm run dev
```

3) Abra o site local e envie o formulário — ele chamará `POST /api/contact` e enviará os e-mails via Resend.


