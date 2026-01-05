#!/usr/bin/env node

/**
 * Script para testar se seu domínio está configurado corretamente no Resend
 * 
 * Uso:
 *   node scripts/test-domain.mjs --to seu-email@exemplo.com
 */

import { Resend } from 'resend';
import { config } from 'dotenv';

// Carrega variáveis de ambiente
config();

const args = process.argv.slice(2);
const toIndex = args.indexOf('--to');
const toEmail = toIndex !== -1 ? args[toIndex + 1] : process.env.ONBOARDING_TO_EMAIL;

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const fromName = process.env.RESEND_FROM_NAME || 'Teste de Domínio';

console.log('\n🔍 Testando configuração do domínio Resend...\n');

// Validações
if (!apiKey) {
  console.error('❌ ERRO: RESEND_API_KEY não configurada no arquivo .env');
  console.log('\n💡 Adicione no arquivo .env:');
  console.log('   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
  process.exit(1);
}

if (!toEmail) {
  console.error('❌ ERRO: E-mail de destino não informado');
  console.log('\n💡 Use: node scripts/test-domain.mjs --to seu-email@exemplo.com\n');
  process.exit(1);
}

// Informações do teste
console.log('📧 Configuração:');
console.log(`   De (from): ${fromName} <${fromEmail}>`);
console.log(`   Para (to): ${toEmail}`);
console.log(`   API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

// Detecta se está usando resend.dev
if (fromEmail.includes('resend.dev')) {
  console.log('\n⚠️  ATENÇÃO: Você está usando o domínio resend.dev!');
  console.log('   Este domínio só permite enviar para SEU PRÓPRIO e-mail.');
  console.log('   Se o destinatário for diferente, você receberá erro 403.\n');
  console.log('   Para enviar para qualquer destinatário, configure um domínio verificado:');
  console.log('   👉 https://resend.com/domains\n');
}

console.log('\n📤 Enviando e-mail de teste...\n');

const resend = new Resend(apiKey);

try {
  const result = await resend.emails.send({
    from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
    to: toEmail,
    subject: '✅ Teste de Domínio Resend',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Teste de Domínio Resend</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>🎉 Sucesso!</strong> Se você está lendo este e-mail, significa que o envio funcionou!
              </div>
              
              <h2>📋 Informações do Envio</h2>
              <ul>
                <li><strong>Remetente:</strong> ${fromName ? `${fromName} <${fromEmail}>` : fromEmail}</li>
                <li><strong>Destinatário:</strong> ${toEmail}</li>
                <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
              </ul>

              ${fromEmail.includes('resend.dev') ? `
              <div class="info">
                <strong>⚠️ Atenção:</strong> Este e-mail foi enviado usando o domínio de teste <code>resend.dev</code>.
                <br><br>
                Para enviar e-mails para qualquer destinatário em produção, você precisa configurar um domínio verificado:
                <br>
                👉 <a href="https://resend.com/domains">https://resend.com/domains</a>
              </div>
              ` : `
              <div class="success">
                <strong>✅ Domínio Verificado!</strong> Você está usando um domínio próprio verificado.
                <br>
                Isso significa que você pode enviar e-mails para qualquer destinatário!
              </div>
              `}

              <h2>🔍 Como Verificar seu Domínio</h2>
              <ol>
                <li>Acesse: <a href="https://resend.com/domains">https://resend.com/domains</a></li>
                <li>Verifique se seu domínio aparece com um ícone verde (✓)</li>
                <li>Se não aparecer, adicione seu domínio e configure os registros DNS</li>
              </ol>

              <div class="footer">
                <p>Este é um e-mail de teste automático gerado pelo script test-domain.mjs</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
✅ Teste de Domínio Resend

🎉 Sucesso! Se você está lendo este e-mail, significa que o envio funcionou!

📋 Informações do Envio:
- Remetente: ${fromName ? `${fromName} <${fromEmail}>` : fromEmail}
- Destinatário: ${toEmail}
- Data/Hora: ${new Date().toLocaleString('pt-BR')}

${fromEmail.includes('resend.dev') ? `
⚠️ Atenção: Este e-mail foi enviado usando o domínio de teste resend.dev.
Para enviar e-mails para qualquer destinatário em produção, você precisa configurar um domínio verificado:
👉 https://resend.com/domains
` : `
✅ Domínio Verificado! Você está usando um domínio próprio verificado.
Isso significa que você pode enviar e-mails para qualquer destinatário!
`}

🔍 Como Verificar seu Domínio:
1. Acesse: https://resend.com/domains
2. Verifique se seu domínio aparece com um ícone verde (✓)
3. Se não aparecer, adicione seu domínio e configure os registros DNS

---
Este é um e-mail de teste automático gerado pelo script test-domain.mjs
    `,
  });

  if (result?.error) {
    console.error('❌ ERRO ao enviar e-mail:\n');
    console.error(JSON.stringify(result.error, null, 2));
    
    if (result.error.message?.includes('403') || result.error.statusCode === 403) {
      console.log('\n🔴 Erro 403 detectado!');
      console.log('\n📖 Possíveis causas:');
      console.log('   1. Você está usando resend.dev e tentando enviar para outro e-mail');
      console.log('   2. Seu domínio não está verificado no Resend');
      console.log('   3. O e-mail do remetente não corresponde ao domínio verificado');
      console.log('\n💡 Solução:');
      console.log('   1. Acesse: https://resend.com/domains');
      console.log('   2. Adicione e verifique seu domínio');
      console.log('   3. Atualize RESEND_FROM_EMAIL no arquivo .env');
      console.log('\n📚 Leia mais: https://resend.com/docs/knowledge-base/403-error-resend-dev-domain\n');
    }
    
    process.exit(1);
  }

  console.log('✅ E-mail enviado com sucesso!\n');
  console.log('📬 Detalhes:');
  console.log(`   ID do e-mail: ${result.data?.id || 'N/A'}`);
  console.log(`   Status: Enviado para ${toEmail}\n`);
  
  if (fromEmail.includes('resend.dev')) {
    console.log('⚠️  Lembre-se: Para usar em produção, configure um domínio verificado!');
    console.log('   👉 https://resend.com/domains\n');
  } else {
    console.log('🎉 Tudo certo! Seu domínio está configurado e funcionando!\n');
  }

} catch (err) {
  console.error('❌ ERRO inesperado:\n');
  console.error(err);
  console.log('\n💡 Verifique:');
  console.log('   1. Se a RESEND_API_KEY está correta');
  console.log('   2. Se você tem conexão com a internet');
  console.log('   3. Se o pacote "resend" está instalado (npm install resend)\n');
  process.exit(1);
}
