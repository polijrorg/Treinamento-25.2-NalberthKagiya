// web/src/utils/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailData) {
  try {
    await resend.emails.send({
      from: 'Clash Cards <lojinha@resend.dev>',
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    // Não falha a rota se o e-mail falhar
  }
}