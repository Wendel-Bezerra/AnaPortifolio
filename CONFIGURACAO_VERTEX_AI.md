# Guia de Configuração do Vertex AI para Gemini CLI

Este guia explica como configurar as variáveis de ambiente necessárias para usar o Vertex AI no Gemini CLI.

## Variáveis de Ambiente Necessárias

Você precisa configurar as seguintes variáveis:

1. **GOOGLE_CLOUD_PROJECT** - ID do seu projeto Google Cloud
2. **GOOGLE_CLOUD_LOCATION** - Região onde o Vertex AI está disponível
3. **GOOGLE_API_KEY** (opcional) - Apenas se usar o modo express

## Passo a Passo

### 1. Criar o arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
GOOGLE_CLOUD_PROJECT=seu-projeto-id-aqui
GOOGLE_CLOUD_LOCATION=us-central1
# GOOGLE_API_KEY=sua-chave-api-aqui
```

### 2. Obter o GOOGLE_CLOUD_PROJECT

1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/)
2. Se você ainda não tem um projeto:
   - Clique em "Selecionar projeto" no topo
   - Clique em "NOVO PROJETO"
   - Dê um nome ao projeto e clique em "Criar"
3. O ID do projeto aparece:
   - No topo da página inicial do console
   - Ou em "Configurações do projeto" (ícone de engrenagem)
4. Copie o ID do projeto (formato: `meu-projeto-123456`)

### 3. Definir o GOOGLE_CLOUD_LOCATION

Escolha uma região onde o Vertex AI está disponível. Opções comuns:

- `us-central1` (Iowa, EUA)
- `us-east1` (Carolina do Sul, EUA)
- `europe-west1` (Bélgica)
- `europe-west4` (Holanda)
- `asia-southeast1` (Singapura)
- `asia-northeast1` (Tóquio, Japão)

**Recomendação:** Use `us-central1` se não tiver preferência específica.

### 4. Obter o GOOGLE_API_KEY (Opcional - apenas para modo express)

Se você estiver usando o modo express do Gemini CLI, também precisa de uma chave de API:

1. Acesse [Credenciais do Google Cloud](https://console.cloud.google.com/apis/credentials)
2. Certifique-se de que o projeto correto está selecionado
3. Clique em "Criar credenciais" > "Chave de API"
4. Uma nova chave será gerada
5. Copie a chave (formato: `AIzaSy...`)
6. **Importante:** Restrinja a chave de API para segurança:
   - Clique na chave criada
   - Em "Restrições de API", selecione "Restringir chave"
   - Selecione apenas as APIs do Gemini/Vertex AI que você precisa

### 5. Habilitar APIs Necessárias

Certifique-se de que as seguintes APIs estão habilitadas no seu projeto:

1. Acesse [Biblioteca de APIs](https://console.cloud.google.com/apis/library)
2. Procure e habilite:
   - **Vertex AI API**
   - **Generative Language API** (se usar modo express)

### 6. Configurar Autenticação (para Vertex AI)

Para usar o Vertex AI (não o modo express), você precisa de autenticação:

#### Opção A: Usando gcloud CLI (Recomendado)

1. Instale o [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Execute:
   ```bash
   gcloud auth login
   gcloud config set project SEU-PROJETO-ID
   gcloud auth application-default login
   ```

#### Opção B: Usando Service Account

1. Acesse [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Clique em "Criar conta de serviço"
3. Dê um nome e clique em "Criar e continuar"
4. Adicione a role "Vertex AI User"
5. Clique em "Concluído"
6. Clique na conta criada > "Chaves" > "Adicionar chave" > "Criar nova chave" > JSON
7. Baixe o arquivo JSON
8. Configure a variável de ambiente:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="caminho/para/seu/arquivo.json"
   ```

## Exemplo de arquivo .env completo

```env
# Projeto Google Cloud
GOOGLE_CLOUD_PROJECT=meu-projeto-gemini-123456

# Região do Vertex AI
GOOGLE_CLOUD_LOCATION=us-central1

# Chave de API (apenas se usar modo express)
GOOGLE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

## Verificar a Configuração

Após configurar, você pode verificar se está funcionando:

```bash
# Verificar variáveis de ambiente (Windows PowerShell)
$env:GOOGLE_CLOUD_PROJECT
$env:GOOGLE_CLOUD_LOCATION

# Ou testar o Gemini CLI
gemini --help
```

## Troubleshooting

### Erro: "Project not found"
- Verifique se o ID do projeto está correto
- Certifique-se de que o projeto existe e você tem acesso

### Erro: "Location not available"
- Verifique se a região está correta
- Algumas regiões podem não ter Vertex AI disponível
- Tente usar `us-central1`

### Erro: "Permission denied" (403 PERMISSION_DENIED)

**Este é um erro comum!** Consulte o guia detalhado: `RESOLVER_ERRO_403.md`

Causas mais comuns:
- APIs não habilitadas no projeto
- Billing não habilitado (requerido mesmo para uso gratuito)
- Permissões insuficientes da conta
- Autenticação não configurada corretamente
- ID do projeto incorreto ou inválido

**Solução rápida:**
1. Habilite billing no projeto: [Console de Billing](https://console.cloud.google.com/billing)
2. Habilite as APIs: [Biblioteca de APIs](https://console.cloud.google.com/apis/library)
   - Vertex AI API
   - Generative Language API (se usar modo express)
3. Configure autenticação: `gcloud auth application-default login`
4. Verifique permissões: [IAM & Admin](https://console.cloud.google.com/iam-admin/iam)
   - Sua conta precisa da role "Vertex AI User" ou superior

Execute o script de verificação: `.\verificar-config-vertex.ps1`

### Erro: "API key invalid"
- Verifique se a chave de API está correta
- Certifique-se de que a API está habilitada no projeto
- Verifique se a chave não foi restringida demais

## Recursos Adicionais

- [Documentação do Vertex AI](https://cloud.google.com/vertex-ai/docs)
- [Documentação do Gemini](https://ai.google.dev/docs)
- [Console do Google Cloud](https://console.cloud.google.com/)

