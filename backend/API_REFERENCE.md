# API Documentation - Renoverde Backend

## Base URL

```
http://localhost:5000/api
```

## Response Format

All endpoints return JSON with the following structure:

### Success (2xx)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    /* response data */
  },
  "pagination": {
    /* optional */
  }
}
```

### Error (4xx, 5xx)

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [
    {
      "field": "email",
      "message": "Email inválido",
      "value": "invalid-email"
    }
  ]
}
```

---

## Authentication Endpoints

### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "admin@renoverde.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "email": "admin@renoverde.com",
    "nome": "Admin User",
    "role": "admin",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

- 401: Email ou senha incorretos

---

### POST /auth/refresh-token

Refresh an expired access token.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token renovado com sucesso",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### GET /auth/me

Get current authenticated user information.

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@renoverde.com",
    "nome": "Admin User",
    "role": "admin",
    "ativo": true,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  }
}
```

**Errors:**

- 401: No token provided
- 401: Token expired
- 404: Usuário não encontrado

---

### POST /auth/logout

Logout user (client removes token).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## Contact Form Endpoints

### POST /contatos

Submit a contact form (public endpoint).

**Request:**

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "+245 123456789",
  "assunto": "Partnership Inquiry",
  "mensagem": "I would like to discuss a potential partnership with Renoverde..."
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Contato enviado com sucesso. Entraremos em contato em breve!",
  "data": {
    "id": 42,
    "status": "novo"
  }
}
```

**Validations:**

- `nome`: min 3 characters
- `email`: valid email format
- `telefone`: optional, valid phone format
- `assunto`: min 5 characters
- `mensagem`: min 10 characters

**Sends emails to:**

- Admin: Contact notification
- User: Confirmation email

---

### GET /contatos

List all contacts (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**

```
page=1          # Page number (default: 1)
limit=20        # Items per page (default: 20)
status=novo     # Filter by status (novo, respondido, descartado)
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "telefone": "+245 123456789",
      "assunto": "Partnership",
      "mensagem": "I would like...",
      "status": "novo",
      "respondido_em": null,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

### GET /contatos/:id

Get a specific contact (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):** Same as individual contact object

**Errors:**

- 404: Contato não encontrado

---

### PATCH /contatos/:id

Update contact status (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**

```json
{
  "status": "respondido"
}
```

**Valid Statuses:**

- `novo`: New contact
- `respondido`: Contacted/Responded
- `descartado`: Dismissed

**Response (200):**

```json
{
  "success": true,
  "message": "Status atualizado com sucesso",
  "data": {
    "id": 1,
    "status": "respondido",
    "respondido_em": "2026-01-15T11:00:00Z"
  }
}
```

---

### DELETE /contatos/:id

Delete a contact (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "Contato deletado com sucesso"
}
```

---

## Blog Endpoints

### GET /blog/posts

List published blog posts with pagination.

**Query Parameters:**

```
page=1          # Page number
limit=10        # Items per page
categoria=1     # Filter by category ID (optional)
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "How to Recycle Plastic",
      "slug": "how-to-recycle-plastic",
      "conteudo": "Detailed guide...",
      "imagem_destaque": "https://...",
      "categoria_id": 1,
      "autor_id": 1,
      "publicado": true,
      "views": 245,
      "created_at": "2026-01-10T08:00:00Z",
      "BlogCategory": {
        "id": 1,
        "nome": "Guides"
      },
      "author": {
        "id": 1,
        "nome": "Admin",
        "email": "admin@renoverde.com"
      }
    }
  ],
  "pagination": {}
}
```

---

### GET /blog/posts/:slug

Get a specific post by slug. Increments view count.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "How to Recycle Plastic",
    "slug": "how-to-recycle-plastic",
    "conteudo": "...",
    "views": 246,
    "created_at": "2026-01-10T08:00:00Z"
  }
}
```

**Errors:**

- 404: Post não encontrado

---

### POST /blog/posts

Create a new blog post (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**

```json
{
  "titulo": "How to Recycle Plastic Correctly",
  "conteudo": "Detailed article content here... (min 50 chars)",
  "categoria_id": 1,
  "imagem_destaque": "https://example.com/image.jpg"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Post criado com sucesso",
  "data": {
    "id": 15,
    "titulo": "How to Recycle Plastic Correctly",
    "slug": "how-to-recycle-plastic-correctly",
    "conteudo": "...",
    "publicado": true
  }
}
```

---

### PUT /blog/posts/:id

Update a blog post (admin or author only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:** Same as POST /blog/posts

**Response (200):** Updated post data

**Errors:**

- 403: You don't have permission to edit this post
- 404: Post não encontrado

---

### DELETE /blog/posts/:id

Delete a blog post (admin or author only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post deletado com sucesso"
}
```

---

### GET /blog/categorias

List all blog categories.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Guides",
      "slug": "guides"
    },
    {
      "id": 2,
      "nome": "News",
      "slug": "news"
    }
  ]
}
```

---

### POST /blog/categorias

Create a new blog category (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**

```json
{
  "nome": "Tutorials"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": 3,
    "nome": "Tutorials",
    "slug": "tutorials"
  }
}
```

---

### GET /blog/posts/:postId/comentarios

Get approved comments for a post.

**Query Parameters:**

```
page=1
limit=10
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "post_id": 1,
      "autor": "Maria Silva",
      "email": "maria@example.com",
      "conteudo": "Great article!",
      "aprovado": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {}
}
```

---

### POST /blog/posts/:postId/comentarios

Submit a comment on a post (public).

**Request:**

```json
{
  "autor": "Maria Silva",
  "email": "maria@example.com",
  "conteudo": "Great article! Very informative."
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Comentário enviado. Aguarde aprovação",
  "data": {
    "id": 42,
    "aprovado": false
  }
}
```

---

### PATCH /blog/comentarios/:commentId/aprovar

Approve a comment (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comentário aprovado",
  "data": {
    "id": 42,
    "aprovado": true
  }
}
```

---

### DELETE /blog/comentarios/:commentId

Delete a comment (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comentário deletado"
}
```

---

## Services Endpoints

### GET /servicos

List all active services.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Plastic Collection",
      "descricao": "We collect plastic waste from...",
      "imagem": "https://...",
      "preco": "150.00",
      "ordem_exibicao": 1,
      "ativo": true
    }
  ]
}
```

---

### GET /servicos/:id

Get a specific service.

**Response (200):** Single service object

---

### POST /servicos

Create a new service (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**

```json
{
  "titulo": "Plastic Recycling",
  "descricao": "Turn plastic waste into new products",
  "imagem": "https://example.com/image.jpg",
  "preco": "200.00",
  "ordem_exibicao": 1
}
```

**Response (201):** Created service object

---

### PUT /servicos/:id

Update a service (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:** Same fields as POST

**Response (200):** Updated service object

---

### DELETE /servicos/:id

Delete a service (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "Serviço deletado com sucesso"
}
```

---

## FAQ Endpoints

### GET /faq

List active FAQs.

**Query Parameters:**

```
categoria=general    # Filter by category (optional)
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pergunta": "How do you process plastic?",
      "resposta": "We use advanced machinery to...",
      "categoria": "general",
      "ordem_exibicao": 1,
      "ativo": true
    }
  ]
}
```

---

### POST /faq

Create a new FAQ (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**

```json
{
  "pergunta": "What types of plastic do you accept?",
  "resposta": "We accept PET, HDPE, LDPE, PP...",
  "categoria": "recycling",
  "ordem_exibicao": 1
}
```

**Response (201):** Created FAQ object

---

### PUT /faq/:id

Update FAQ (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:** Same as POST

**Response (200):** Updated FAQ object

---

### DELETE /faq/:id

Delete FAQ (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**

```json
{
  "success": true,
  "message": "FAQ deletado com sucesso"
}
```

---

## Team Endpoints

### GET /equipe

List all team members.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "cargo": "CEO",
      "bio": "Founder and CEO of Renoverde...",
      "foto": "https://...",
      "email": "joao@renoverde.com",
      "redes_sociais": {
        "linkedin": "https://linkedin.com/in/joao",
        "twitter": "@joao"
      }
    }
  ]
}
```

---

### GET /equipe/:id

Get a specific team member.

**Response (200):** Single member object

---

### POST /equipe

Add team member (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request:**

```json
{
  "nome": "Maria Santos",
  "cargo": "Operations Manager",
  "bio": "10+ years in waste management",
  "foto": "https://...",
  "email": "maria@renoverde.com",
  "redes_sociais": {
    "linkedin": "https://linkedin.com/in/maria"
  }
}
```

**Response (201):** Created member object

---

### PUT /equipe/:id

Update team member (admin only).

**Request:** Same fields as POST

**Response (200):** Updated member object

---

### DELETE /equipe/:id

Remove team member (admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Membro removido com sucesso"
}
```

---

## Newsletter Endpoints

### POST /newsletter/subscribe

Subscribe to newsletter (public).

**Request:**

```json
{
  "email": "user@example.com",
  "nome": "João Silva"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Inscrição realizada com sucesso!"
}
```

**Errors:**

- 409: Este email já está inscrito

---

### POST /newsletter/unsubscribe

Unsubscribe from newsletter (public).

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Inscrição cancelada com sucesso"
}
```

**Errors:**

- 404: Email não encontrado na newsletter

---

### GET /newsletter/subscribers

List newsletter subscribers (admin only).

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**

```
page=1
limit=50
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "nome": "João Silva",
      "ativo": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {}
}
```

---

## HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created              |
| 204  | No Content                              |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing/invalid token    |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource doesn't exist      |
| 409  | Conflict - Resource already exists      |
| 422  | Unprocessable Entity - Validation error |
| 500  | Internal Server Error                   |

---

## Common Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation errors",
  "statusCode": 422,
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "No token provided",
  "statusCode": 401
}
```

### Authorization Error

```json
{
  "success": false,
  "message": "Insufficient permissions",
  "statusCode": 403
}
```

### Not Found

```json
{
  "success": false,
  "message": "Post não encontrado",
  "statusCode": 404
}
```

---

**Last Updated:** April 6, 2026
**API Version:** 1.0.0
