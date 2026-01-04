import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const getArg = (name) => {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
};

const positional = process.argv.slice(2).filter((a) => !String(a).startsWith('--'));
const id = getArg('id') || positional[0];
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('Faltou RESEND_API_KEY no ambiente.');
  process.exit(1);
}

if (!id) {
  console.error('Informe o id do e-mail: node scripts/check-email-status.mjs --id <EMAIL_ID>');
  process.exit(1);
}

const resend = new Resend(apiKey);
const result = await resend.emails.get(id);

if (result?.error) {
  console.error('Erro ao consultar e-mail:', result.error);
  process.exit(1);
}

const email = result?.data;
console.log('Status:', email?.last_event);
console.log('Criado em:', email?.created_at);
console.log('De:', email?.from);
console.log('Para:', Array.isArray(email?.to) ? email.to.join(', ') : email?.to);
console.log('Assunto:', email?.subject);


