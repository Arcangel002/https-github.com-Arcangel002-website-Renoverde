import { Service, Product, Launch, FAQ, TeamMember, NewsletterSubscriber } from '../models/index.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

// ═══════════════════════════════════════════════
// OFFLINE FALLBACK DATA
// ═══════════════════════════════════════════════

const offlineServices = [
  {
    id: 1,
    titulo: 'Recolha de Plásticos',
    descricao: 'Serviço profissional de recolha de resíduos plásticos em empresas e residências.',
    imagem: '/img/plastic.jfif',
    preco: 50.00,
    ativo: true,
    ordem_exibicao: 1,
    created_at: new Date(),
  },
  {
    id: 2,
    titulo: 'Reciclagem Industrial',
    descricao: 'Processamento e reciclagem de grandes volumes de plástico industrial.',
    imagem: '/img/plastic extruder.jfif',
    preco: 200.00,
    ativo: true,
    ordem_exibicao: 2,
    created_at: new Date(),
  },
];

const offlineFAQs = [
  {
    id: 1,
    pergunta: 'Quais tipos de resíduos vocês recolhem?',
    resposta: 'Recolhemos plásticos de todos os tipos, papel, metal, vidro e eletrónicos.',
    categoria: 'serviços',
    ativo: true,
    created_at: new Date(),
  },
  {
    id: 2,
    pergunta: 'Como funciona o agendamento?',
    resposta: 'Você pode agendar uma recolha através do nosso site ou aplicativo.',
    categoria: 'agendamento',
    ativo: true,
    created_at: new Date(),
  },
];

const offlineTeam = [
  {
    id: 1,
    nome: 'João Silva',
    cargo: 'Diretor Executivo',
    email: 'joao@renoverde.gw',
    telefone: '+245 123 456 789',
    ativo: true,
    created_at: new Date(),
  },
];

const offlineProducts = [
  {
    id: 1,
    titulo: 'Mesa de Plástico Reciclado',
    descricao: 'Mesa resistente feita de plástico 100% reciclado.',
    imagem: '/img/mesa de plástico reciclado.jfif',
    preco: 150.00,
    ativo: true,
    created_at: new Date(),
  },
  {
    id: 2,
    titulo: 'Copo Ecológico',
    descricao: 'Copo reutilizável feito de plástico reciclado.',
    imagem: '/img/copo.jfif',
    preco: 5.00,
    ativo: true,
    created_at: new Date(),
  },
];

const offlineLaunches = [
  {
    id: 1,
    titulo: 'Novo Centro de Reciclagem',
    descricao: 'Inauguração do nosso novo centro de reciclagem com tecnologia de ponta.',
    imagem: '/img/ciclo de produto.jfif',
    data_lancamento: new Date('2024-12-01'),
    ativo: true,
    created_at: new Date(),
  },
];

const offlineSubscribers = [];
let offlineSubscriberId = 1;

// ═══════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════

export const getServices = asyncHandler(async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { ativo: true },
      order: [['ordem_exibicao', 'ASC']],
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (dbError) {
    console.warn('Database unavailable, using offline services data');
    res.json({
      success: true,
      data: offlineServices,
    });
  }
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

// ═══════════════════════════════════════════════// PRODUCTS
// ═══════════════════════════════════════════════

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { ativo: true },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.warn('Database unavailable, using offline products data');
    res.json({
      success: true,
      data: offlineProducts,
    });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado');
  }

  res.json({
    success: true,
    data: product,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { titulo, descricao, imagem, preco } = req.body;

  const product = await Product.create({
    titulo,
    descricao,
    imagem,
    preco,
  });

  res.status(201).json({
    success: true,
    message: 'Produto criado com sucesso',
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, imagem, preco, ativo } = req.body;

  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado');
  }

  Object.assign(product, {
    titulo,
    descricao,
    imagem,
    preco,
    ativo,
  });

  await product.save();

  res.json({
    success: true,
    message: 'Produto atualizado com sucesso',
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, 'Produto não encontrado');
  }

  await product.destroy();

  res.json({
    success: true,
    message: 'Produto removido com sucesso',
  });
});

// ═══════════════════════════════════════════════
// LAUNCHES
// ═══════════════════════════════════════════════

export const getLaunches = asyncHandler(async (req, res) => {
  try {
    const launches = await Launch.findAll({
      where: { ativo: true },
      order: [['data_lancamento', 'DESC']],
    });

    res.json({
      success: true,
      data: launches,
    });
  } catch (error) {
    console.warn('Database unavailable, using offline launches data');
    res.json({
      success: true,
      data: offlineLaunches,
    });
  }
});

export const getLaunchById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const launch = await Launch.findByPk(id);
  if (!launch) {
    throw new ApiError(404, 'Lançamento não encontrado');
  }

  res.json({
    success: true,
    data: launch,
  });
});

export const createLaunch = asyncHandler(async (req, res) => {
  const { titulo, descricao, imagem, data_lancamento } = req.body;

  const launch = await Launch.create({
    titulo,
    descricao,
    imagem,
    data_lancamento,
  });

  res.status(201).json({
    success: true,
    message: 'Lançamento criado com sucesso',
    data: launch,
  });
});

export const updateLaunch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, imagem, data_lancamento, ativo } = req.body;

  const launch = await Launch.findByPk(id);
  if (!launch) {
    throw new ApiError(404, 'Lançamento não encontrado');
  }

  Object.assign(launch, {
    titulo,
    descricao,
    imagem,
    data_lancamento,
    ativo,
  });

  await launch.save();

  res.json({
    success: true,
    message: 'Lançamento atualizado com sucesso',
    data: launch,
  });
});

export const deleteLaunch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const launch = await Launch.findByPk(id);
  if (!launch) {
    throw new ApiError(404, 'Lançamento não encontrado');
  }

  await launch.destroy();

  res.json({
    success: true,
    message: 'Lançamento removido com sucesso',
  });
});

// ═══════════════════════════════════════════════// FAQ
// ═══════════════════════════════════════════════

export const getFAQs = asyncHandler(async (req, res) => {
  const { categoria } = req.query;

  try {
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
  } catch (error) {
    console.warn('Database unavailable, using offline FAQs data');
    const faqs = categoria ? offlineFAQs.filter(faq => faq.categoria === categoria) : offlineFAQs;
    res.json({
      success: true,
      data: faqs,
    });
  }
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
  try {
    const team = await TeamMember.findAll({
      order: [['nome', 'ASC']],
    });

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.warn('Database unavailable, using offline team data');
    res.json({
      success: true,
      data: offlineTeam,
    });
  }
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

  try {
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
  } catch (error) {
    console.warn('Database unavailable, using offline newsletter storage');
    // Check if already subscribed in offline mode
    const existingSubscriber = offlineSubscribers.find(sub => sub.email === email);
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
        return res.json({
          success: true,
          message: 'Inscrição reativada com sucesso',
        });
      }
    }

    // Add new subscriber
    offlineSubscribers.push({
      id: offlineSubscriberId++,
      email,
      nome,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Inscrição realizada com sucesso!',
    });
  }
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
