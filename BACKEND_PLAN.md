# 📋 Plano de Implementação Backend - Renoverde

## 📊 Visão Geral do Projeto

- **Tipo**: Site institucional + Plataforma interativa
- **Nicho**: Reciclagem de plásticos (Guiné-Bissau)
- **Stack Sugerida**: Node.js + Express (ou Python/FastAPI)

---

## 🎯 Funcionalidades Identificadas que Necessitam Backend

### 1️⃣ **Gestão de Formulários**

- ✅ Formulário de contato (contact.html)
- ✅ Newsletter/Subscrição
- ✅ Solicitação de orçamento
- ✅ Parceria/Colaboração

### 2️⃣ **Blog e Conteúdo**

- ✅ Listagem de artigos (blog.html)
- ✅ Detalhe de artigos (blog_detail.html)
- ✅ Comentários em artigos
- ✅ Categorias de posts

### 3️⃣ **E-commerce (Potencial)**

- ✅ Catálogo de produtos/serviços
- ✅ Carrinho de compras
- ✅ Integração de pagamento

### 4️⃣ **Gestão de Dados**

- ✅ Equipe (team.html - informações dinâmicas)
- ✅ FAQ (faq.html - perguntas frequentes dinâmicas)
- ✅ Serviços (services.html)
- ✅ Galeria de produtos/projetos

---

## 🏗️ Arquitetura Recomendada

```
Backend/
├── API REST ou GraphQL
├── Banco de Dados (PostgreSQL/MongoDB)
├── Autenticação (JWT)
├── Sistema de Email
├── Sistema de Arquivos
└── Admin Dashboard
```

---

## 📦 Stack Técnica Recomendada

### **Opção 1: Node.js + Express (Recomendado)**

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "banco_dados": "PostgreSQL",
  "autenticacao": "JWT + Bcrypt",
  "email": "Nodemailer + Mailtrap/SendGrid",
  "upload": "Multer + Cloudinary/AWS S3",
  "validacao": "Joi/Zod",
  "api_style": "REST"
}
```

### **Opção 2: Python + FastAPI**

```json
{
  "runtime": "Python 3.10+",
  "framework": "FastAPI",
  "banco_dados": "PostgreSQL + SQLAlchemy",
  "autenticacao": "JWT",
  "email": "Mailgun/SendGrid",
  "upload": "Cloudinary/AWS S3"
}
```

---

## 🗄️ Modelo de Dados

### **Tabelas/Collections Necessárias**

```
┌─ users
│  ├── id (UUID)
│  ├── email (unique)
│  ├── password_hash
│  ├── nome
│  ├── role (admin, user)
│  ├── created_at
│  └── updated_at

├─ contacts (formulário de contato)
│  ├── id
│  ├── nome
│  ├── email
│  ├── telefone
│  ├── assunto
│  ├── mensagem
│  ├── status (novo, respondido, descartado)
│  ├── created_at

├─ blog_posts
│  ├── id
│  ├── titulo
│  ├── slug
│  ├── conteudo
│  ├── imagem_destaque
│  ├── categoria_id (FK)
│  ├── autor_id (FK)
│  ├── publicado
│  ├── views
│  ├── created_at
│  └── updated_at

├─ blog_categorias
│  ├── id
│  ├── nome
│  └── slug

├─ blog_comentarios
│  ├── id
│  ├── post_id (FK)
│  ├── autor
│  ├── email
│  ├── conteudo
│  ├── aprovado
│  └── created_at

├─ servicos
│  ├── id
│  ├── titulo
│  ├── descricao
│  ├── imagem
│  ├── preco (opcional)
│  ├── ordem_exibicao
│  └── ativo

├─ equipe
│  ├── id
│  ├── nome
│  ├── cargo
│  ├── bio
│  ├── foto
│  ├── email
│  └── redes_sociais (JSON)

├─ faq
│  ├── id
│  ├── pergunta
│  ├── resposta
│  ├── categoria
│  ├── ordem_exibicao
│  └── ativo

├─ orcamentos (se implementar)
│  ├── id
│  ├── email_cliente
│  ├── descricao_projeto
│  ├── status
│  └── created_at

└─ newsletter_subscribers
   ├── id
   ├── email (unique)
   ├── nome
   ├── subscrito_em
   └── ativo
```

---

## 🔌 Endpoints da API (REST)

### **Contatos**

```
POST   /api/contatos              - Enviar formulário de contato
GET    /api/admin/contatos        - Listar contatos (admin)
GET    /api/admin/contatos/:id    - Detalhe do contato (admin)
PATCH  /api/admin/contatos/:id    - Atualizar status (admin)
DELETE /api/admin/contatos/:id    - Deletar (admin)
```

### **Blog**

```
GET    /api/blog/posts            - Listar posts com paginação
GET    /api/blog/posts/:slug      - Detalhe do post
GET    /api/blog/categorias       - Listar categorias
POST   /api/admin/blog/posts      - Criar post (admin)
PUT    /api/admin/blog/posts/:id  - Editar post (admin)
DELETE /api/admin/blog/posts/:id  - Deletar post (admin)

GET    /api/blog/posts/:id/comentarios      - Listar comentários
POST   /api/blog/posts/:id/comentarios      - Enviar comentário
DELETE /api/admin/comentarios/:id           - Deletar comentário (admin)
PATCH  /api/admin/comentarios/:id/aprovar   - Aprovar comentário (admin)
```

### **Serviços**

```
GET    /api/servicos              - Listar serviços
GET    /api/servicos/:id          - Detalhe do serviço
POST   /api/admin/servicos        - Criar (admin)
PUT    /api/admin/servicos/:id    - Editar (admin)
DELETE /api/admin/servicos/:id    - Deletar (admin)
```

### **Equipe**

```
GET    /api/equipe                - Listar equipe
GET    /api/equipe/:id            - Detalhe do membro
POST   /api/admin/equipe          - Adicionar membro (admin)
PUT    /api/admin/equipe/:id      - Editar membro (admin)
DELETE /api/admin/equipe/:id      - Remover membro (admin)
```

### **FAQ**

```
GET    /api/faq                   - Listar FAQs
GET    /api/faq?categoria=X       - FAQs por categoria
POST   /api/admin/faq             - Criar FAQ (admin)
PUT    /api/admin/faq/:id         - Editar FAQ (admin)
DELETE /api/admin/faq/:id         - Deletar FAQ (admin)
```

### **Autenticação/Admin**

```
POST   /api/auth/login            - Login
POST   /api/auth/logout           - Logout
POST   /api/auth/register         - Registro (se aplicável)
GET    /api/auth/me               - Dados do usuário logado
```

### **Newsletter**

```
POST   /api/newsletter/subscribe   - Inscrever
POST   /api/newsletter/unsubscribe - Desinscrever
```

---

## 🔒 Segurança

### **Implementações Obrigatórias**

- ✅ Validação de entrada (XSS, SQL Injection)
- ✅ CORS configurado corretamente
- ✅ Rate limiting em endpoints públicos
- ✅ Hash de senhas (bcrypt)
- ✅ JWT com refresh tokens
- ✅ Sanitização de dados
- ✅ HTTPS em produção
- ✅ Variáveis de ambiente para secrets
- ✅ Proteção contra CSRF
- ✅ Helmet.js (headers de segurança)

---

## 📧 Integrações Necessárias

### **Email**

- Nodemailer para envio automático
- Templates HTML para:
  - Confirmação de contato
  - Notificação para admin
  - Confirmação de newsletter

### **Upload de Arquivos**

- Cloudinary ou AWS S3 para:
  - Imagens de blog
  - Fotos de equipe
  - Documentos

### **Analytics/Monitoramento** (Opcional)

- Google Analytics
- Sentry para error tracking
- UptimeRobot para monitoramento

---

## 📱 Frontend - Backend Integration

### **Headers HTTP Esperados**

```javascript
// Frontend
fetch("/api/contatos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer token_jwt", // se necessário
  },
  body: JSON.stringify(formData),
});
```

### **Formato de Respostas**

```json
// Sucesso
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { /* dados */ }
}

// Erro
{
  "success": false,
  "message": "Erro ao processar",
  "errors": { /* detalhes */ },
  "statusCode": 400
}
```

---

## 📋 Plano de Implementação (Fase)

### **Fase 1: MVP** (2-3 semanas)

1. Setup inicial do projeto
2. Banco de dados
3. Autenticação básica
4. Endpoints de contato
5. Sistema de email

### **Fase 2: Conteúdo** (2 semanas)

1. CRUD de blog posts
2. CRUD de serviços
3. CRUD de FAQ
4. Sistema de comentários

### **Fase 3: Avançado** (2 semanas)

1. Dashboard admin completo
2. Sistema de equipagem/equipe
3. Newsletter
4. Orçamentos

### **Fase 4: Otimização** (1 semana)

1. Testes unitários
2. Deploy em produção
3. Monitoramento e logs
4. Documentação da API

---

## 🚀 Deployment

### **Opções Recomendadas**

- **Node.js**: Vercel, Heroku, Railway, Render
- **Python**: Heroku, PythonAnywhere, Railway
- **Banco**: PostgreSQL em Vercel/Railway/AWS RDS
- **Storage**: Cloudinary (recomendado) ou AWS S3

---

## 📚 Tecnologias Específicas

### **Node.js + Express (Starter)**

```bash
# Dependências principais
npm install express dotenv cors helmet express-validator
npm install bcryptjs jsonwebtoken
npm install mongoose ou sequelize
npm install nodemailer
npm install multer
npm install axios

# Dev
npm install -D nodemon jest supertest
```

### **Python + FastAPI (Starter)**

```bash
pip install fastapi uvicorn
pip install sqlalchemy psycopg2
pip install pydantic
pip install python-jose python-multipart
pip install aiofiles
pip install httpx
```

---

## ✅ Checklist Antes de Começar

- [ ] Definir linguagem (Node.js ou Python)
- [ ] Criar repositório Git
- [ ] Configurar banco de dados
- [ ] Criar variáveis de ambiente (.env)
- [ ] Definir política de branching (git flow ou main)
- [ ] Estruturar pasta do projeto
- [ ] Configurar linter + prettier
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Preparar ambiente de produção

---

## 📞 Próximos Passos

1. **Clique para começar**: Escolha a stack e execute o setup inicial
2. **Criar estrutura**: Pasta, arquivos base, .env
3. **Banco de dados**: Setup local e em cloud
4. **Desenvolvimento**: Comece com endpoints de contato
5. **Integração**: Conecte o frontend aos endpoints

---

_Última atualização: 06/04/2026_
