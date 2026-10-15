const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type EmailResult = { success: boolean; error?: string };

async function sendBrevoEmail({
  to,
  subject,
  html,
  fromName,
}: {
  to: string;
  subject: string;
  html: string;
  fromName: string;
}): Promise<EmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { success: false, error: "BREVO_API_KEY non configuré" };
  }

  const from = process.env.FROM_EMAIL;
  if (!from) {
    return { success: false, error: "FROM_EMAIL non configuré" };
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: fromName, email: from },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (res.ok) {
      return { success: true };
    }

    const body = await res.json().catch(() => null);
    const message = body?.message || `Erreur Brevo (HTTP ${res.status})`;
    return { success: false, error: friendlyEmailError(message) };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function sendReplyEmail({
  to,
  subject,
  reply,
  originalContent,
  name,
}: {
  to: string;
  subject: string;
  reply: string;
  originalContent: string;
  name: string;
}): Promise<EmailResult> {
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #2D2D2D;">
      <div style="background: #1E3A5F; padding: 32px 24px; text-align: center;">
        <h1 style="color: #C9A962; margin: 0; font-size: 22px; font-weight: 600;">Abdenour Hellas</h1>
        <p style="color: #F5F5F0; margin: 8px 0 0; font-size: 14px;">Ingénieur en Génie Électrique</p>
      </div>
      <div style="padding: 32px 24px; background: #FFFFFF; border: 1px solid #E5E5E0;">
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6;">Bonjour ${escapeHtml(name)},</p>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6;">
          Merci pour votre message. Voici ma réponse :
        </p>
        <div style="background: #F5F5F0; border-left: 4px solid #C9A962; padding: 20px 24px; margin: 0 0 24px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1E3A5F; white-space: pre-wrap;">${escapeHtml(reply)}</p>
        </div>
        <div style="border-top: 1px solid #E5E5E0; padding-top: 20px; margin-top: 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;">Votre message original</p>
          <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.6; font-style: italic;">${escapeHtml(originalContent)}</p>
        </div>
      </div>
      <div style="padding: 24px; text-align: center; background: #F5F5F0;">
        <p style="margin: 0; font-size: 12px; color: #6B7280;">
          © ${new Date().getFullYear()} Abdenour Hellas ·
          <a href="https://abdenour-hellas.online" style="color: #1E3A5F; text-decoration: none;">abdenour-hellas.online</a>
        </p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to,
    subject: `Re: ${subject}`,
    html,
    fromName: "Abdenour Hellas",
  });
}

export async function sendNewMessageNotification({
  name,
  email,
  subject,
  content,
}: {
  name: string;
  email: string;
  subject: string;
  content: string;
}): Promise<EmailResult> {
  const to = process.env.ADMIN_EMAIL || "abdenour.hellas@uqat.ca";

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #2D2D2D;">
      <div style="background: #1E3A5F; padding: 32px 24px; text-align: center;">
        <h1 style="color: #C9A962; margin: 0; font-size: 22px; font-weight: 600;">Nouveau message reçu</h1>
      </div>
      <div style="padding: 32px 24px; background: #FFFFFF; border: 1px solid #E5E5E0;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;"><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p style="margin: 0 0 24px; font-size: 14px; color: #6B7280;"><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <div style="background: #F5F5F0; border-left: 4px solid #C9A962; padding: 20px 24px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1E3A5F; white-space: pre-wrap;">${escapeHtml(content)}</p>
        </div>
      </div>
      <div style="padding: 24px; text-align: center; background: #F5F5F0;">
        <p style="margin: 0; font-size: 12px; color: #6B7280;">
          Connectez-vous à l'admin pour répondre :
          <a href="https://abdenour-hellas.online/admin/messages" style="color: #1E3A5F; text-decoration: none;">Admin Messages</a>
        </p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to,
    subject: `Nouveau message : ${subject}`,
    html,
    fromName: "Portfolio",
  });
}

function friendlyEmailError(message: string): string {
  if (/daily (sending )?limit|quota|exceeded/i.test(message)) {
    return "Quota quotidien Brevo atteint (300 emails/jour en offre gratuite). Le quota se réinitialise chaque jour.";
  }
  if (/not verified|unverified|invalid sender/i.test(message)) {
    return "Expéditeur non vérifié dans Brevo : ajoutez et vérifiez l'adresse FROM_EMAIL dans Brevo > Paramètres > Expéditeurs et IP.";
  }
  return message;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
