import { Resend } from 'resend';
import { buildOnboardingEmail } from './_lib/emailTemplates.js';

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const getRequestBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Test-Token');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Método não permitido.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const siteName = process.env.SITE_NAME || 'Ana Cecília & José Olavo';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = process.env.RESEND_FROM_NAME || '';
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;
  const token = process.env.ONBOARDING_TEST_TOKEN;

  if (!apiKey) return json(res, 500, { ok: false, error: 'RESEND_API_KEY não configurada.' });
  if (!token) return json(res, 500, { ok: false, error: 'ONBOARDING_TEST_TOKEN não configurado.' });

  const provided = req.headers['x-test-token'];
  if (!provided || String(provided) !== token) {
    return json(res, 401, { ok: false, error: 'Token inválido.' });
  }

  const body = await getRequestBody(req);
  const to = String(body?.to ?? process.env.ONBOARDING_TO_EMAIL ?? '').trim();
  const name = String(body?.name ?? 'Cliente').trim();

  if (!to) return json(res, 400, { ok: false, error: 'Informe o destinatário (to).' });

  const resend = new Resend(apiKey);
  const onboarding = buildOnboardingEmail({ siteName, name });

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: onboarding.subject,
      html: onboarding.html,
      text: onboarding.text,
    });

    if (result?.error) {
      console.error('Resend error (onboarding):', result.error);
      return json(res, 502, { ok: false, error: 'Falha ao enviar onboarding.', details: result.error });
    }

    return json(res, 200, { ok: true, id: result?.data?.id ?? null });
  } catch (err) {
    console.error('Erro ao enviar onboarding via Resend:', err);
    return json(res, 500, { ok: false, error: 'Falha ao enviar onboarding.' });
  }
}


