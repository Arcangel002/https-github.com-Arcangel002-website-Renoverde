import { Contact } from '../models/index.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/email.js';

// In-memory storage for offline mode
const offlineContacts = [];
let contactId = 1;

export const createContact = asyncHandler(async (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;

  let contact;

  try {
    // Try database first
    contact = await Contact.create({
      nome,
      email,
      telefone,
      assunto,
      mensagem,
    });
  } catch (dbError) {
    // Fallback to in-memory storage if database fails
    console.warn('Database unavailable, using offline storage for contact');
    contact = {
      id: contactId++,
      nome,
      email,
      telefone,
      assunto,
      mensagem,
      status: 'recebido',
      created_at: new Date(),
      updated_at: new Date(),
    };
    offlineContacts.push(contact);
  }

  // Send email to admin (only if email is configured)
  try {
    if (process.env.ADMIN_EMAIL && process.env.EMAIL_USER) {
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
    }
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

  try {
    // Try database first
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Contact.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
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
  } catch (dbError) {
    // Fallback to offline storage
    console.warn('Database unavailable, using offline storage for contacts');
    const filteredContacts = status
      ? offlineContacts.filter(c => c.status === status)
      : offlineContacts;

    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginatedContacts = filteredContacts.slice(start, end);

    res.json({
      success: true,
      data: paginatedContacts,
      pagination: {
        total: filteredContacts.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredContacts.length / limit),
      },
    });
  }
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
