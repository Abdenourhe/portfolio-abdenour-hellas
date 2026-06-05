import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
}) {
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY non configuré" };
  }

  const from = process.env.FROM_EMAIL || "onboarding@resend.dev";

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
          <a href="https://portfolio-abdenour-hellas.vercel.app" style="color: #1E3A5F; text-decoration: none;">portfolio-abdenour-hellas.vercel.app</a>
        </p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `Abdenour Hellas <${from}>`,
      to,
      subject: `Re: ${subject}`,
      html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
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
}) {
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY non configuré" };
  }

  const to = process.env.ADMIN_EMAIL || "abdenour.hellas@uqat.ca";
  const from = process.env.FROM_EMAIL || "onboarding@resend.dev";

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
          <a href="https://portfolio-abdenour-hellas.vercel.app/admin/messages" style="color: #1E3A5F; text-decoration: none;">Admin Messages</a>
        </p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `Portfolio <${from}>`,
      to,
      subject: `Nouveau message : ${subject}`,
      html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
