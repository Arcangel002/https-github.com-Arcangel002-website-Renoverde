import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  telefone: {
    type: DataTypes.STRING,
  },
  assunto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('novo', 'respondido', 'descartado'),
    defaultValue: 'novo',
  },
  respondido_em: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'contacts',
  timestamps: true,
});

export const BlogPost = sequelize.define('BlogPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagem_destaque: {
    type: DataTypes.STRING,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
  },
  autor_id: {
    type: DataTypes.INTEGER,
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'blog_posts',
  timestamps: true,
});

export const BlogCategory = sequelize.define('BlogCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  tableName: 'blog_categories',
  timestamps: true,
});

export const BlogComment = sequelize.define('BlogComment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  aprovado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'blog_comments',
  timestamps: true,
});

export const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  imagem: {
    type: DataTypes.STRING,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
  },
  ordem_exibicao: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'services',
  timestamps: true,
});

export const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  imagem: {
    type: DataTypes.STRING,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

export const Launch = sequelize.define('Launch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  imagem: {
    type: DataTypes.STRING,
  },
  data_lancamento: {
    type: DataTypes.DATE,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'launches',
  timestamps: true,
});

export const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  foto: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
  },
  redes_sociais: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'team_members',
  timestamps: true,
});

export const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pergunta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resposta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
  },
  ordem_exibicao: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'faqs',
  timestamps: true,
});

export const NewsletterSubscriber = sequelize.define('NewsletterSubscriber', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  nome: {
    type: DataTypes.STRING,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'newsletter_subscribers',
  timestamps: true,
});

// Define associations
BlogPost.belongsTo(BlogCategory, { foreignKey: 'categoria_id' });
BlogPost.belongsTo(User, { foreignKey: 'autor_id', as: 'author' });
BlogPost.hasMany(BlogComment, { foreignKey: 'post_id' });

BlogComment.belongsTo(BlogPost, { foreignKey: 'post_id' });

export default {
  User,
  Contact,
  BlogPost,
  BlogCategory,
  BlogComment,
  Service,
  Product,
  Launch,
  TeamMember,
  FAQ,
  NewsletterSubscriber,
};
