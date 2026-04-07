# 🌱 Renoverde - Frontend & Backend Setup Complete

## ✅ What's Been Done

### Backend Server

- ✅ **Status**: Running on `http://localhost:5001`
- ✅ **Framework**: Express.js (Node.js)
- ✅ **Database**: PostgreSQL (optional, offline mode enabled)
- ✅ **Features**:
  - JWT Authentication
  - Contact Management API
  - Blog Posts & Comments
  - Services Management
  - FAQ Management
  - Team Management
  - Newsletter Subscription
  - Email Integration Ready

### Frontend

- ✅ **Main Website**: `index.html` - Consolidated single-page application
- ✅ **Features**:
  - Home/Hero Section
  - About Renoverde
  - Services Showcase (API-driven)
  - Blog Section (API-driven)
  - FAQ Section (API-driven)
  - Contact Form (API-integrated)
  - Newsletter Subscription
  - Responsive Design
  - Modern CSS with Animation

- ✅ **Admin Dashboard**: `admin.html` - Content management interface
  - Dashboard with statistics
  - Blog management
  - Services management
  - Team management
  - FAQ management
  - Contact messages
  - Newsletter subscriber management

### Cleaned Up

- ✅ Removed duplicate HTML files:
  - `about.html` → Merged into index.html
  - `blog.html` → Merged into index.html
  - `blog_detail.html` → Merged into index.html
  - `contact.html` → Merged into index.html
  - `faq.html` → Merged into index.html
  - `services.html` → Merged into index.html
  - `team.html` → Integrated into admin dashboard
  - `detail.html` → Removed (unclear purpose)

### New Files Created

- ✅ `app.js` - Main application controller with routing and API integration
- ✅ `admin.html` - Admin dashboard for content management
- ✅ `FRONTEND_README.md` - This file

---

## 🚀 How to Access

### Frontend (Public Website)

```
http://localhost/index.html
or
file:///c:/Users/HP/OneDrive/Documentos/renoverde/website-Renoverde/index.html
```

### Admin Dashboard

```
http://localhost/admin.html
or
file:///c:/Users/HP/OneDrive/Documentos/renoverde/website-Renoverde/admin.html
```

### Backend API

```
Base URL: http://localhost:5001/api

Key Endpoints:
- GET    /api/health              - Server status
- POST   /api/auth/register       - User registration
- POST   /api/auth/login          - User login
- GET    /api/servicos            - List services
- GET    /api/blog/posts          - List blog posts
- GET    /api/faq                 - List FAQs
- POST   /api/contatos            - Submit contact form
- POST   /api/newsletter/subscribe - Subscribe to newsletter
```

---

## 📋 Feature Status

### ✅ Implemented

- [x] Responsive frontend layout
- [x] API integration (services, blog, FAQ)
- [x] Contact form submission
- [x] Newsletter subscription
- [x] Admin dashboard UI
- [x] Offline-friendly backend
- [x] Modern component architecture

### 🔄 In Progress

- [ ] Admin authentication
- [ ] Full CRUD operations for admin features
- [ ] Database integration
- [ ] Email notifications

### 📝 TODO

- [ ] Deploy frontend to web server
- [ ] Setup PostgreSQL database
- [ ] Complete admin authentication
- [ ] Implement real-time notifications
- [ ] Setup SSL/HTTPS
- [ ] Performance optimization

---

## 🔧 Configuration

### Backend .env

Located at: `backend/.env`

```
API_URL=http://localhost:5001
PORT=5001
DATABASE=PostgreSQL
NODE_ENV=development
```

### Frontend API Config

Location: `app.js` line 3

```javascript
const API_BASE_URL = "http://localhost:5001/api";
```

---

## 📱 Pages & Routes

### Main Website (index.html)

| Page     | URL       | Status        |
| -------- | --------- | ------------- |
| Home     | #home     | ✅ Active     |
| Services | #services | ✅ API-driven |
| Blog     | #blog     | ✅ API-driven |
| About    | #about    | ✅ Active     |
| FAQ      | #faq      | ✅ API-driven |
| Contact  | #contact  | ✅ Functional |

### Admin (admin.html)

| Section             | Status             |
| ------------------- | ------------------ |
| Dashboard           | ✅ Statistics only |
| Blog Management     | 🔄 In development  |
| Services Management | 🔄 In development  |
| Team Management     | 🔄 In development  |
| FAQ Management      | 🔄 In development  |
| Contacts            | 📋 Read-only       |
| Newsletter          | 📋 Read-only       |

---

## 🎨 Design System

### Colors

- Primary Green: `#1a6b3a`
- Light Green: `#2d9b57`
- Pale Green: `#eaf5ee`
- Black: `#0d1a12`
- Off-white: `#f7faf8`

### Fonts

- Headers: Syne (sans-serif)
- Body: DM Sans (sans-serif)

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🔗 Integration Notes

### API Response Format

All endpoints return:

```json
{
  "success": true,
  "data": [...],
  "message": "Description",
  "statusCode": 200
}
```

### Frontend-to-API Flow

1. User interacts with frontend (index.html)
2. JavaScript event listeners trigger API calls (app.js)
3. Fetch requests sent to backend (http://localhost:5001/api)
4. Response data renders dynamically in the DOM
5. Admin dashboard monitors/manages content

---

## 🚨 Troubleshooting

### Backend Not Starting?

1. Check if port 5001 is available
2. Ensure Node.js 18+ is installed
3. Run: `npm install` in backend folder
4. Check .env file exists and is readable

### Frontend Not Loading Data?

1. Verify backend is running on http://localhost:5001
2. Check browser console for CORS errors
3. Verify API endpoints match backend routes
4. Check network tab in DevTools

### Admin Dashboard Empty?

1. This is normal - CRUD functions are in development
2. Statistics should show on dashboard
3. Click "Início Rápido" for quick actions

---

## 📞 Support

For issues or questions about the Renoverde platform:

- **Email**: renoverdereciclagem@gmail.com
- **Phone**: +(245) 956 262 289
- **Location**: Bissau, Guiné-Bissau

---

**Last Updated**: April 7, 2026  
**Version**: 1.0.0  
**Status**: Development (Offline Mode)
