import { Resend } from 'resend';
import { buildOnboardingEmail } from '../api/_lib/emailTemplates.js';
import dotenv from 'dotenv';

const getArg = (name) => {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
};

// Carrega variáveis do .env para testes locais (se existir)
dotenv.config({ override: true });

const positional = process.argv.slice(2).filter((a) => !String(a).startsWith('--'));
const to = getArg('to') || positional[0] || process.env.ONBOARDING_TO_EMAIL;
const name = getArg('name') || positional[1] || 'Cliente';
const siteName = process.env.SITE_NAME || 'Ana Cecília & José Olavo';
const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('Faltou RESEND_API_KEY no ambiente.');
  process.exit(1);
}

if (!to) {
  console.error('Informe o destinatário com --to email@exemplo.com (ou ONBOARDING_TO_EMAIL).');
  process.exit(1);
}

const resend = new Resend(apiKey);
const onboarding = buildOnboardingEmail({ siteName, name });

const result = await resend.emails.send({
  from,
  to,
  subject: onboarding.subject,
  html: onboarding.html,
  text: onboarding.text,
});

if (result?.error) {
  console.error('Falha ao enviar via Resend:', result.error);
  process.exit(1);
}

console.log('Enviado:', result?.data?.id || result);


