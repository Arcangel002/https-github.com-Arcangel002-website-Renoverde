import { BlogPost, BlogCategory, BlogComment } from '../models/index.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// ─── POSTS ───
export const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, categoria } = req.query;
  const offset = (page - 1) * limit;

  const where = { publicado: true };
  if (categoria) where.categoria_id = categoria;

  const { count, rows } = await BlogPost.findAndCountAll({
    where,
    include: [
      { association: 'BlogCategory' },
      { association: 'author', attributes: ['id', 'nome', 'email'] },
    ],
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

export const getPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await BlogPost.findOne({
    where: { slug, publicado: true },
    include: [
      { association: 'BlogCategory' },
      { association: 'author', attributes: ['id', 'nome'] },
    ],
  });

  if (!post) {
    throw new ApiError(404, 'Post não encontrado');
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post,
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const { titulo, conteudo, categoria_id, imagem_destaque } = req.body;

  const slug = generateSlug(titulo);

  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ where: { slug } });
  if (existingPost) {
    throw new ApiError(409, 'Já existe um post com este título');
  }

  const post = await BlogPost.create({
    titulo,
    slug,
    conteudo,
    categoria_id,
    imagem_destaque,
    autor_id: req.user.id,
    publicado: true,
  });

  res.status(201).json({
    success: true,
    message: 'Post criado com sucesso',
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo, categoria_id, imagem_destaque, publicado } = req.body;

  const post = await BlogPost.findByPk(id);
  if (!post) {
    throw new ApiError(404, 'Post não encontrado');
  }

  // Check authorization
  if (post.autor_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Você não tem permissão para editar este post');
  }

  if (titulo && titulo !== post.titulo) {
    post.slug = generateSlug(titulo);
  }

  Object.assign(post, {
    titulo,
    conteudo,
    categoria_id,
    imagem_destaque,
    publicado,
  });

  await post.save();

  res.json({
    success: true,
    message: 'Post atualizado com sucesso',
    data: post,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await BlogPost.findByPk(id);
  if (!post) {
    throw new ApiError(404, 'Post não encontrado');
  }

  // Check authorization
  if (post.autor_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Você não tem permissão para deletar este post');
  }

  await post.destroy();

  res.json({
    success: true,
    message: 'Post deletado com sucesso',
  });
});

// ─── CATEGORIES ───
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.findAll({
    order: [['nome', 'ASC']],
  });

  res.json({
    success: true,
    data: categories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { nome } = req.body;

  const slug = generateSlug(nome);

  const category = await BlogCategory.create({
    nome,
    slug,
  });

  res.status(201).json({
    success: true,
    message: 'Categoria criada com sucesso',
    data: category,
  });
});

// ─── COMMENTS ───
export const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows } = await BlogComment.findAndCountAll({
    where: { post_id: postId, aprovado: true },
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

export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { autor, email, conteudo } = req.body;

  // Verify post exists
  const post = await BlogPost.findByPk(postId);
  if (!post) {
    throw new ApiError(404, 'Post não encontrado');
  }

  const comment = await BlogComment.create({
    post_id: postId,
    autor,
    email,
    conteudo,
    aprovado: false,
  });

  res.status(201).json({
    success: true,
    message: 'Comentário enviado. Aguarde aprovação',
    data: comment,
  });
});

export const approveComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await BlogComment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comentário não encontrado');
  }

  comment.aprovado = true;
  await comment.save();

  res.json({
    success: true,
    message: 'Comentário aprovado',
    data: comment,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await BlogComment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comentário não encontrado');
  }

  await comment.destroy();

  res.json({
    success: true,
    message: 'Comentário deletado',
  });
});
