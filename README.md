# 🚀 MyNet.tn - B2B Procurement Platform

Production-ready B2B procurement platform for Tunisia featuring comprehensive tender management, offer processing, and invoice handling.

## 📋 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

**Backend**: http://localhost:3000  
**Frontend**: http://localhost:5000

## 📁 Project Structure

See `PROJECT_STRUCTURE.md` for detailed architecture documentation.

```
MyNet.tn/
├── backend/           # Express.js API server
├── frontend/          # React + Vite SPA
├── DOCS/              # Documentation (77+ files)
└── PROJECT_STRUCTURE.md
```

## ✨ Key Features

- 🏢 Complete B2B procurement system
- 📋 Tender lifecycle management
- 💰 Offer and invoice handling
- 🔐 Enterprise security (AES-256 encryption)
- 👥 Role-based access control
- 📱 Responsive mobile-first design
- 🌐 100% French localization
- 📊 Advanced analytics
- 🔔 Real-time notifications
- 📧 Email integration

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + httpOnly cookies
- **Validation**: Joi schemas
- **Encryption**: AES-256
- **Real-time**: WebSocket (socket.io)

### Frontend
- **Library**: React 18
- **Build**: Vite
- **UI**: Material-UI
- **HTTP**: Axios
- **i18n**: i18next (French)
- **Routing**: React Router DOM

## 📊 Database

- **Tables**: 22 comprehensive tables
- **Relationships**: Properly normalized
- **Soft Deletes**: Implemented
- **Audit Logging**: Built-in
- **Encryption**: On sensitive data

## 🔐 Security Features

- ✅ Multi-layer input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CSRF protection
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Password hashing (bcryptjs)
- ✅ JWT token management
- ✅ AES-256 encryption
- ✅ Audit trail logging
- ✅ Role-based access control

## 📚 Documentation

All documentation in `/DOCS` folder:

- **VALIDATION_COMPLETE.txt** - Type validation guide
- **TYPE_VALIDATION_IMPLEMENTATION.md** - Validation details
- **AUDIT_COMPLETION_REPORT.md** - Security audit
- **PROJECT_STRUCTURE.md** - Architecture guide
- **CODE_QUALITY_CHECKLIST.md** - Quality standards
- And 70+ additional files

## 🚀 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## ✅ Quality Standards

- ✅ 0 console logs in production code
- ✅ Type validation on all inputs
- ✅ Comprehensive error handling
- ✅ 100% French localization
- ✅ WCAG 2.1 accessibility
- ✅ Responsive design
- ✅ Security hardened
- ✅ Performance optimized

## 📞 Support

For issues or questions, refer to documentation in `/DOCS` folder.

## 📝 License

MIT License

---

**Status**: Production Ready  
**Last Updated**: 2025-11-25  
**Version**: 1.2.0
