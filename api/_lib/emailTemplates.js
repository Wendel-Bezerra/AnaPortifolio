const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export function buildContactNotificationEmail({ siteName, name, email, message }) {
  const safeSiteName = escapeHtml(siteName);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const subject = `Novo contato pelo site — ${name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2 style="margin: 0 0 12px 0;">Novo contato recebido</h2>
      <p style="margin: 0 0 18px 0;">
        Você recebeu uma nova mensagem pelo formulário do site <strong>${safeSiteName}</strong>.
      </p>

      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #e5e7eb; width: 140px;"><strong>Nome</strong></td>
          <td style="padding: 8px 10px; border: 1px solid #e5e7eb;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #e5e7eb;"><strong>E-mail</strong></td>
          <td style="padding: 8px 10px; border: 1px solid #e5e7eb;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #e5e7eb; vertical-align: top;"><strong>Mensagem</strong></td>
          <td style="padding: 8px 10px; border: 1px solid #e5e7eb;">${safeMessage}</td>
        </tr>
      </table>

      <p style="margin: 18px 0 0 0; font-size: 12px; color: #6b7280;">
        Dica: responda este e-mail para responder diretamente ao contato (Reply-To configurado).
      </p>
    </div>
  `;

  const text = `Novo contato recebido (${siteName})

Nome: ${name}
E-mail: ${email}
Mensagem:
${message}
`;

  return { subject, html, text };
}

export function buildContactSuccessEmail({ siteName, name }) {
  const subject = `Recebemos sua mensagem — ${siteName}`;
  const safeSiteName = escapeHtml(siteName);
  const safeName = escapeHtml(name);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin: 0 0 12px 0;">Mensagem recebida</h2>
      <p style="margin: 0 0 12px 0;">Olá, ${safeName}!</p>
      <p style="margin: 0 0 12px 0;">
        Obrigado por entrar em contato com <strong>${safeSiteName}</strong>.
        Sua mensagem foi recebida com sucesso e retornaremos assim que possível.
      </p>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #374151;">
        Se desejar complementar informações, basta responder este e-mail.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 18px 0;" />
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        Este é um e-mail automático de confirmação.
      </p>
    </div>
  `;

  const text = `Olá, ${name}!

Obrigado por entrar em contato com ${siteName}. Sua mensagem foi recebida com sucesso e retornaremos assim que possível.

Se desejar complementar informações, basta responder este e-mail.
`;

  return { subject, html, text };
}

export function buildOnboardingEmail({ siteName, name }) {
  const safeSiteName = escapeHtml(siteName);
  const safeName = escapeHtml(name);
  const subject = `Bem-vindo(a)! — ${siteName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin: 0 0 12px 0;">Bem-vindo(a)!</h2>
      <p style="margin: 0 0 12px 0;">Olá, ${safeName}!</p>
      <p style="margin: 0 0 12px 0;">
        Este é um e-mail de onboarding (teste) para confirmar que o envio via <strong>Resend</strong> está funcionando no site <strong>${safeSiteName}</strong>.
      </p>
      <ul style="margin: 0 0 12px 18px; padding: 0;">
        <li>Integração de envio: OK</li>
        <li>Templates HTML/texto: OK</li>
        <li>Configuração de remetente e destinatário via variáveis de ambiente: OK</li>
      </ul>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        Se você recebeu este e-mail, o teste passou.
      </p>
    </div>
  `;

  const text = `Bem-vindo(a)!

Olá, ${name}!
Este é um e-mail de onboarding (teste) para confirmar que o envio via Resend está funcionando no site ${siteName}.

Se você recebeu este e-mail, o teste passou.
`;

  return { subject, html, text };
}


