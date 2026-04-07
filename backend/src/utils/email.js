import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT == 465,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

// Simple HTML templates
const templates = {
  'contact-admin': (data) => `
    <h2>Novo Contato Recebido</h2>
    <p><strong>Nome:</strong> ${data.nome}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Telefone:</strong> ${data.telefone || 'Não informado'}</p>
    <p><strong>Assunto:</strong> ${data.assunto}</p>
    <hr>
    <h3>Mensagem:</h3>
    <p>${data.mensagem.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><small>ID do contato: ${data.id}</small></p>
  `,

  'contact-confirmation': (data) => `
    <h2>Obrigado por Entrar em Contato!</h2>
    <p>Olá ${data.nome},</p>
    <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
    <p>Nossa equipe em Renoverde agradece por sua preferência.</p>
    <hr>
    <p><strong>Renoverde Reciclagem</strong></p>
    <p>Guiné-Bissau</p>
  `,

  'newsletter-welcome': (data) => `
    <h2>Bem-vindo à Newsletter Renoverde!</h2>
    <p>Olá ${data.nome || 'leitor'},</p>
    <p>Agora você receberá as notícias mais importantes sobre reciclagem e sustentabilidade.</p>
    <p>Obrigado por se juntar a nós!</p>
    <hr>
    <p><strong>Renoverde Reciclagem</strong></p>
  `,
};

export const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const htmlContent = templates[template]?.(data) || '';

    const mailOptions = {
      from: config.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

export const sendBulkEmail = async (emails, subject, template, data) => {
  const results = [];

  for (const email of emails) {
    try {
      const result = await sendEmail({
        to: email,
        subject,
        template,
        data,
      });
      results.push({ email, success: true, messageId: result.messageId });
    } catch (error) {
      results.push({ email, success: false, error: error.message });
    }
  }

  return results;
};

export const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error);
    return false;
  }
};
