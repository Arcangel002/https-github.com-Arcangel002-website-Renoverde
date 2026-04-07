import { Contact } from '../models/index.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/email.js';

export const createContact = asyncHandler(async (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;

  // Create contact
  const contact = await Contact.create({
    nome,
    email,
    telefone,
    assunto,
    mensagem,
  });

  // Send email to admin
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Novo Contato: ${assunto}`,
      template: 'contact-admin',
      data: {
        nome,
        email,
        telefone,
        assunto,
        mensagem,
        id: contact.id,
      },
    });

    // Send confirmation to user
    await sendEmail({
      to: email,
      subject: 'Contato Recebido - Renoverde',
      template: 'contact-confirmation',
      data: { nome },
    });
  } catch (error) {
    console.error('Erro ao enviar emails:', error);
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Contato enviado com sucesso. Entraremos em contato em breve!',
    data: {
      id: contact.id,
      status: contact.status,
    },
  });
});

export const getContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;

  const { count, rows } = await Contact.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['created_at', 'DESC']],
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(count / limit),
    },
  });
});

export const getContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new ApiError(404, 'Contato não encontrado');
  }

  res.json({
    success: true,
    data: contact,
  });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['novo', 'respondido', 'descartado'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Status inválido');
  }

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new ApiError(404, 'Contato não encontrado');
  }

  contact.status = status;
  if (status === 'respondido') {
    contact.respondido_em = new Date();
  }
  await contact.save();

  res.json({
    success: true,
    message: 'Status atualizado com sucesso',
    data: contact,
  });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new ApiError(404, 'Contato não encontrado');
  }

  await contact.destroy();

  res.json({
    success: true,
    message: 'Contato deletado com sucesso',
  });
});
