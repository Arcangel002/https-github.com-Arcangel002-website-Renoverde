# 🌱 Renoverde Backend API

Backend API for Renoverde website - A plastic recycling platform in Guinea-Bissau.

## 📋 Quick Start

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** 12+
- **npm** or **yarn**

### Installation

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Then edit `.env` with your database and email credentials.

4. **Create PostgreSQL database**

```sql
CREATE DATABASE renoverde_db;
```

5. **Start development server**

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Sequelize connection
│   │   └── env.js        # Environment variables
│   ├── controllers/      # Business logic
│   │   ├── auth.controller.js
│   │   ├── contact.controller.js
│   │   ├── blog.controller.js
│   │   └── content.controller.js
│   ├── models/           # Database models
│   │   └── index.js      # Sequelize models
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   ├── contact.routes.js
│   │   ├── blog.routes.js
│   │   ├── service.routes.js
│   │   ├── faq.routes.js
│   │   ├── team.routes.js
│   │   └── newsletter.routes.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── validation.js # Request validation
│   │   └── errorHandler.js
│   └── utils/            # Utility functions
│       └── email.js      # Email service
├── server.js             # Main entry point
├── package.json
└── .env.example
```

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/login           # Login user
POST   /api/auth/refresh-token   # Refresh JWT token
POST   /api/auth/logout          # Logout user
GET    /api/auth/me              # Get current user info
```

### Contacts (Public submission, Admin management)

```
POST   /api/contatos                    # Submit contact form
GET    /api/contatos                    # List contacts (admin)
GET    /api/contatos/:id                # Get contact (admin)
PATCH  /api/contatos/:id                # Update status (admin)
DELETE /api/contatos/:id                # Delete contact (admin)
```

### Blog Posts

```
GET    /api/blog/posts                  # List published posts
GET    /api/blog/posts/:slug            # Get post by slug
POST   /api/blog/posts                  # Create post (admin)
PUT    /api/blog/posts/:id              # Update post (admin)
DELETE /api/blog/posts/:id              # Delete post (admin)
```

### Blog Categories

```
GET    /api/blog/categorias             # List categories
POST   /api/blog/categorias             # Create category (admin)
```

### Blog Comments

```
GET    /api/blog/posts/:postId/comentarios        # Get approved comments
POST   /api/blog/posts/:postId/comentarios        # Submit comment
PATCH  /api/blog/comentarios/:id/aprovar          # Approve comment (admin)
DELETE /api/blog/comentarios/:id                  # Delete comment (admin)
```

### Services

```
GET    /api/servicos                 # List active services
GET    /api/servicos/:id             # Get service by ID
POST   /api/servicos                 # Create service (admin)
PUT    /api/servicos/:id             # Update service (admin)
DELETE /api/servicos/:id             # Delete service (admin)
```

### FAQ

```
GET    /api/faq                      # List active FAQs
POST   /api/faq                      # Create FAQ (admin)
PUT    /api/faq/:id                  # Update FAQ (admin)
DELETE /api/faq/:id                  # Delete FAQ (admin)
```

### Team

```
GET    /api/equipe                   # List team members
GET    /api/equipe/:id               # Get team member by ID
POST   /api/equipe                   # Add team member (admin)
PUT    /api/equipe/:id               # Update team member (admin)
DELETE /api/equipe/:id               # Remove team member (admin)
```

### Newsletter

```
POST   /api/newsletter/subscribe     # Subscribe to newsletter
POST   /api/newsletter/unsubscribe   # Unsubscribe from newsletter
GET    /api/newsletter/subscribers   # Get subscribers (admin)
```

---

## 🔐 Authentication

### Getting Access Token

1. **Login with existing credentials:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@renoverde.com",
    "password": "your_password"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "email": "admin@renoverde.com",
    "nome": "Admin",
    "role": "admin",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

2. **Use token in requests:**

```bash
curl -X GET http://localhost:5000/api/admin/contatos \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📧 Email Setup

The API uses Nodemailer for sending emails. Configure in `.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@renoverde.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

**For Gmail:**

1. Enable 2-factor authentication
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use app password in `EMAIL_PASSWORD`

---

## 🧪 Testing Endpoints

### Contact Form (Public)

```bash
curl -X POST http://localhost:5000/api/contatos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "+245 123456789",
    "assunto": "Parceria",
    "mensagem": "Gostaria de conversar sobre uma possível parceria"
  }'
```

### Create Blog Post (Admin Only)

```bash
curl -X POST http://localhost:5000/api/blog/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "titulo": "Como Reciclar Plástico Corretamente",
    "conteudo": "Este é um guia completo sobre como reciclar plástico...",
    "categoria_id": 1,
    "imagem_destaque": "url_da_imagem"
  }'
```

### Subscribe Newsletter (Public)

```bash
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com",
    "nome": "João"
  }'
```

---

## 📚 Database Schema

Key tables:

- **users** - Admin and user accounts
- **contacts** - Contact form submissions
- **blog_posts** - Blog articles
- **blog_categories** - Blog post categories
- **blog_comments** - Post comments
- **services** - Service offerings
- **team_members** - Team member information
- **faqs** - Frequently asked questions
- **newsletter_subscribers** - Newsletter subscriptions

---

## 🚀 Deployment

### To Production Environment:

1. **Update environment variables:**

```bash
NODE_ENV=production
DB_HOST=your_production_db
DB_NAME=renoverde_prod
JWT_SECRET=long_random_string
```

2. **Install dependencies:**

```bash
npm install --production
```

3. **Start server:**

```bash
npm start
```

### Recommended Hosting:

- **Vercel** (Node.js apps)
- **Railway** (Full stack)
- **Render** (Web services)
- **Heroku** (Platform as a Service)

Database:

- **Vercel PostgreSQL**
- **AWS RDS**
- **Railway PostgreSQL**

---

## 🔧 Available Scripts

```bash
npm run dev        # Start development server with auto-reload
npm start          # Start production server
npm test           # Run tests
npm run lint       # Run ESLint
```

---

## 📖 Response Format

All API responses follow this format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 🐛 Troubleshooting

**Database connection failed:**

- Check PostgreSQL is running
- Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Ensure database exists: `CREATE DATABASE renoverde_db;`

**Email not sending:**

- Verify `EMAIL_USER` and `EMAIL_PASSWORD`
- For Gmail, use app-specific password
- Check `EMAIL_HOST` and `EMAIL_PORT` settings

**JWT token errors:**

- Ensure `JWT_SECRET` is set in `.env`
- Check token format in Authorization header: `Bearer <token>`
- Tokens expire after `JWT_EXPIRES_IN` time

---

## 📝 Next Steps

1. ✅ Setup and installation
2. ✅ Database configuration
3. ⬜ Connect frontend to API
4. ⬜ Setup admin dashboard
5. ⬜ Configure production deployment
6. ⬜ Setup monitoring and logging
7. ⬜ Add unit and integration tests

---

## 📞 Support

For issues or questions:

- Check error messages and logs
- Review endpoint documentation above
- Verify environment variables are set correctly

---

**Happy coding! 🌱**

_Last updated: 06/04/2026_
