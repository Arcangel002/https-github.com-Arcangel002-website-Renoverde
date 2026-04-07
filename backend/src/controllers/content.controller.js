import { Service, FAQ, TeamMember, NewsletterSubscriber } from '../models/index.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

// ═══════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════

export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.findAll({
    where: { ativo: true },
    order: [['ordem_exibicao', 'ASC']],
  });

  res.json({
    success: true,
    data: services,
  });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByPk(id);
  if (!service) {
    throw new ApiError(404, 'Serviço não encontrado');
  }

  res.json({
    success: true,
    data: service,
  });
});

export const createService = asyncHandler(async (req, res) => {
  const { titulo, descricao, imagem, preco, ordem_exibicao } = req.body;

  const service = await Service.create({
    titulo,
    descricao,
    imagem,
    preco,
    ordem_exibicao,
  });

  res.status(201).json({
    success: true,
    message: 'Serviço criado com sucesso',
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, imagem, preco, ordem_exibicao, ativo } = req.body;

  const service = await Service.findByPk(id);
  if (!service) {
    throw new ApiError(404, 'Serviço não encontrado');
  }

  Object.assign(service, {
    titulo,
    descricao,
    imagem,
    preco,
    ordem_exibicao,
    ativo,
  });

  await service.save();

  res.json({
    success: true,
    message: 'Serviço atualizado com sucesso',
    data: service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByPk(id);
  if (!service) {
    throw new ApiError(404, 'Serviço não encontrado');
  }

  await service.destroy();

  res.json({
    success: true,
    message: 'Serviço deletado com sucesso',
  });
});

// ═══════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════

export const getFAQs = asyncHandler(async (req, res) => {
  const { categoria } = req.query;

  const where = { ativo: true };
  if (categoria) where.categoria = categoria;

  const faqs = await FAQ.findAll({
    where,
    order: [['ordem_exibicao', 'ASC']],
  });

  res.json({
    success: true,
    data: faqs,
  });
});

export const createFAQ = asyncHandler(async (req, res) => {
  const { pergunta, resposta, categoria, ordem_exibicao } = req.body;

  const faq = await FAQ.create({
    pergunta,
    resposta,
    categoria,
    ordem_exibicao,
  });

  res.status(201).json({
    success: true,
    message: 'FAQ criado com sucesso',
    data: faq,
  });
});

export const updateFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { pergunta, resposta, categoria, ordem_exibicao, ativo } = req.body;

  const faq = await FAQ.findByPk(id);
  if (!faq) {
    throw new ApiError(404, 'FAQ não encontrado');
  }

  Object.assign(faq, {
    pergunta,
    resposta,
    categoria,
    ordem_exibicao,
    ativo,
  });

  await faq.save();

  res.json({
    success: true,
    message: 'FAQ atualizado com sucesso',
    data: faq,
  });
});

export const deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const faq = await FAQ.findByPk(id);
  if (!faq) {
    throw new ApiError(404, 'FAQ não encontrado');
  }

  await faq.destroy();

  res.json({
    success: true,
    message: 'FAQ deletado com sucesso',
  });
});

// ═══════════════════════════════════════════════
// TEAM
// ═══════════════════════════════════════════════

export const getTeam = asyncHandler(async (req, res) => {
  const team = await TeamMember.findAll({
    order: [['nome', 'ASC']],
  });

  res.json({
    success: true,
    data: team,
  });
});

export const getTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await TeamMember.findByPk(id);
  if (!member) {
    throw new ApiError(404, 'Membro não encontrado');
  }

  res.json({
    success: true,
    data: member,
  });
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const { nome, cargo, bio, foto, email, redes_sociais } = req.body;

  const member = await TeamMember.create({
    nome,
    cargo,
    bio,
    foto,
    email,
    redes_sociais,
  });

  res.status(201).json({
    success: true,
    message: 'Membro adicionado com sucesso',
    data: member,
  });
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, bio, foto, email, redes_sociais } = req.body;

  const member = await TeamMember.findByPk(id);
  if (!member) {
    throw new ApiError(404, 'Membro não encontrado');
  }

  Object.assign(member, {
    nome,
    cargo,
    bio,
    foto,
    email,
    redes_sociais,
  });

  await member.save();

  res.json({
    success: true,
    message: 'Membro atualizado com sucesso',
    data: member,
  });
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await TeamMember.findByPk(id);
  if (!member) {
    throw new ApiError(404, 'Membro não encontrado');
  }

  await member.destroy();

  res.json({
    success: true,
    message: 'Membro removido com sucesso',
  });
});

// ═══════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email, nome } = req.body;

  // Check if already subscribed
  const existingSubscriber = await NewsletterSubscriber.findOne({
    where: { email },
  });

  if (existingSubscriber) {
    if (existingSubscriber.ativo) {
      return res.status(409).json({
        success: false,
        message: 'Este email já está inscrito',
        statusCode: 409,
      });
    } else {
      // Reactivate
      existingSubscriber.ativo = true;
      await existingSubscriber.save();

      return res.json({
        success: true,
        message: 'Inscrição reativada com sucesso',
      });
    }
  }

  await NewsletterSubscriber.create({
    email,
    nome,
  });

  res.status(201).json({
    success: true,
    message: 'Inscrição realizada com sucesso!',
  });
});

export const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const subscriber = await NewsletterSubscriber.findOne({
    where: { email },
  });

  if (!subscriber) {
    throw new ApiError(404, 'Email não encontrado na newsletter');
  }

  subscriber.ativo = false;
  await subscriber.save();

  res.json({
    success: true,
    message: 'Inscrição cancelada com sucesso',
  });
});

export const getNewsletterSubscribers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows } = await NewsletterSubscriber.findAndCountAll({
    where: { ativo: true },
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
