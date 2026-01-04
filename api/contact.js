import { Resend } from 'resend';
import {
  buildContactNotificationEmail,
  buildContactSuccessEmail,
} from './_lib/emailTemplates.js';

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

const isProd = () => process.env.NODE_ENV === 'production';

const parseEmailList = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return [];
  return raw
    .split(/[,\n;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
};

const debugString = (value) => ({
  json: JSON.stringify(value ?? null),
  length: String(value ?? '').length,
  codes: Array.from(String(value ?? '')).map((ch) => ch.charCodeAt(0)),
});

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

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(req, res) {
  // CORS (útil caso você hospede front/back em domínios diferentes)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'Método não permitido.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toOwnerList = parseEmailList(process.env.CONTACT_TO_EMAIL);
  const siteName = process.env.SITE_NAME || 'Ana Cecília & José Olavo';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  // Evita falhas de validação em alguns provedores/SDKs com nomes contendo acentos/símbolos.
  // Se você quiser nome no remetente, defina explicitamente RESEND_FROM_NAME (ASCII).
  const fromName = process.env.RESEND_FROM_NAME || '';
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  if (!apiKey) return json(res, 500, { ok: false, error: 'RESEND_API_KEY não configurada.' });
  if (!toOwnerList.length) return json(res, 500, { ok: false, error: 'CONTACT_TO_EMAIL não configurada.' });

  const body = await getRequestBody(req);
  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const message = String(body?.message ?? '').trim();
  const company = String(body?.company ?? '').trim(); // honeypot anti-spam

  // Honeypot: se preenchido, finge sucesso e não envia nada
  if (company) return json(res, 200, { ok: true });

  if (name.length < 2) return json(res, 400, { ok: false, error: 'Informe seu nome.' });
  if (!isValidEmail(email)) return json(res, 400, { ok: false, error: 'Informe um e-mail válido.' });
  if (message.length < 10) return json(res, 400, { ok: false, error: 'Escreva uma mensagem um pouco mais detalhada.' });
  if (message.length > 4000) return json(res, 400, { ok: false, error: 'Mensagem muito longa.' });

  const resend = new Resend(apiKey);

  const notif = buildContactNotificationEmail({ siteName, name, email, message });
  const success = buildContactSuccessEmail({ siteName, name });

  try {
    // 1) Email de aviso (para você/office)
    const notifResult = await resend.emails.send({
      from,
      to: toOwnerList,
      subject: notif.subject,
      html: notif.html,
      text: notif.text,
      replyTo: email,
    });

    // 2) Email de sucesso (para quem preencheu)
    const successResult = await resend.emails.send({
      from,
      to: email,
      subject: success.subject,
      html: success.html,
      text: success.text,
    });

    if (notifResult?.error) {
      console.error('Resend error (notif):', notifResult.error);
      return json(res, 502, {
        ok: false,
        error: 'Falha ao enviar o e-mail de aviso.',
        ...(isProd()
          ? {}
          : {
              details: notifResult.error,
              debug: {
                from,
                toOwnerList,
                visitorEmail: email,
                env: {
                  CONTACT_TO_EMAIL: debugString(process.env.CONTACT_TO_EMAIL),
                  RESEND_FROM_EMAIL: debugString(process.env.RESEND_FROM_EMAIL),
                },
              },
            }),
      });
    }
    if (successResult?.error) {
      console.error('Resend error (success):', successResult.error);
      return json(res, 502, {
        ok: false,
        error: 'Falha ao enviar o e-mail de confirmação.',
        ...(isProd()
          ? {}
          : {
              details: successResult.error,
              debug: {
                from,
                toOwnerList,
                visitorEmail: email,
                env: {
                  CONTACT_TO_EMAIL: debugString(process.env.CONTACT_TO_EMAIL),
                  RESEND_FROM_EMAIL: debugString(process.env.RESEND_FROM_EMAIL),
                },
              },
            }),
      });
    }

    return json(res, 200, {
      ok: true,
      ids: {
        notification: notifResult?.data?.id ?? null,
        success: successResult?.data?.id ?? null,
      },
    });
  } catch (err) {
    // Evita vazar dados sensíveis
    console.error('Erro ao enviar e-mail via Resend:', err);
    return json(res, 500, { ok: false, error: 'Falha ao enviar. Tente novamente em instantes.' });
  }
}


