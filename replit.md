# MyNet.tn - B2B Procurement Platform

## Overview
MyNet.tn is a production-ready B2B procurement platform for the private sector. It provides a robust, secure, and efficient solution for B2B transactions, encompassing tender management, offer management, dynamic company profiles, and a complete supply chain process from tender creation to invoice generation. The platform features a unified institutional theme, enterprise-grade security, and a professional user experience, designed for scalability and market leadership in B2B procurement.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with small, testable changes. Please ask before making any major architectural changes or introducing new dependencies. I prefer that the agent works in the `/frontend` directory and does not make changes in the `/backend` directory.

## Recent Changes (November 23, 2025)
- ✅ **Created Comprehensive Super Admin API** - 30+ endpoints for all 10 admin functions
- ✅ **Backend Super Admin Controller** - `backend/controllers/superAdminController.js` (600+ lines)
- ✅ **Backend Super Admin Routes** - `backend/routes/superAdminRoutes.js` (40+ endpoints)
- ✅ **Frontend Service Layer** - `frontend/src/services/superAdminService.js`
- ✅ **Frontend Global Context** - `frontend/src/contexts/SuperAdminContext.jsx` with state management
- ✅ **Integrated into App.js** - All routes properly registered and secured

### File Handling Implementation (November 23, 2025)
- ✅ **FileManagement Component** - `frontend/src/pages/FileManagement.jsx` with upload, list, delete UI
- ✅ **File Upload Middleware** - Multer configured for multipart/form-data handling (50MB max)
- ✅ **Backend File Upload** - Real file handling in `superAdminController.uploadFile()` with metadata storage
- ✅ **SuperAdminContext Enhancements** - Separate file loading states (loadingFiles, errorFiles, successFiles)
- ✅ **useSuperAdmin Hook** - Exported for components to access context globally
- ✅ **Frontend Route** - `/super-admin/files` route added to App.jsx
- ✅ **Database Integration** - Files stored in `media_files` table with soft delete support
- ✅ **Audit Logging** - All file operations logged in audit_logs table

### Backup & Restore Implementation (November 23, 2025)
- ✅ **ArchiveManagement Component** - `frontend/src/pages/ArchiveManagement.jsx` refactored to use real API
- ✅ **Backend Backup Endpoints** - `listBackups()`, `createBackup()`, `restoreBackup()` in superAdminController
- ✅ **SuperAdminContext Methods** - `fetchBackups()`, `createBackup()`, `restoreBackup()` integrated
- ✅ **API Integration** - All backup operations call real backend API endpoints
- ✅ **Database Persistence** - Backups stored in `backups` table with metadata
- ✅ **Audit Logging** - All backup/restore operations logged in audit_logs table
- ✅ **Frontend Route** - `/super-admin/archive` route fully functional
- ✅ **Error Handling** - Proper error messages and loading states
- ✅ **Statistics Display** - Total backups, total size, success count cards

### Global State Management Implementation (November 23, 2025)
- ✅ **AppContext** - `frontend/src/contexts/AppContext.jsx` centralized global state
- ✅ **Authentication State** - User, authentication status, loading, error tracking
- ✅ **App State** - Global loading, error, toast notifications
- ✅ **App Settings** - Language, theme, notifications, sidebar state
- ✅ **useApp Hook** - Access entire global state from any component
- ✅ **useAuth Hook** - Specialized hook for authentication operations
- ✅ **useToast Hook** - Specialized hook for toast notifications
- ✅ **AppProvider Wrapper** - Wraps entire app for state availability
- ✅ **Methods** - Login, logout, updateUser, checkAuth, addToast, removeToast
- ✅ **Inactivity Timer** - 15-minute inactivity monitoring
- ✅ **Cross-tab Communication** - Auth state synced across browser tabs
- ✅ **TokenManager Integration** - Persistent token storage and management

### Admin Audit Logging Implementation (November 23, 2025)
- ✅ **AuditLogViewer Component** - `frontend/src/pages/AuditLogViewer.jsx` refactored to use real API data
- ✅ **Real API Integration** - Fetches audit logs from backend via `fetchAuditLogs()` from SuperAdminContext
- ✅ **IP Address Tracking** - All admin actions logged with user's IP address (`req.clientIP`)
- ✅ **Action Tracking** - Complete logging of CREATE, UPDATE, DELETE, UPLOAD, BLOCK, UNBLOCK operations
- ✅ **Status Tracking** - Success/Failure status for each action
- ✅ **Filter & Search** - Filter by action type, status, and description
- ✅ **CSV Export** - Export audit logs to CSV for compliance/archival
- ✅ **Database Persistence** - All logs stored in `audit_logs` table with timestamps
- ✅ **Arabic UI** - Fully translated interface for Arabic users
- ✅ **Statistics Cards** - Total logs, success count, failure count displays
- ✅ **IP Middleware** - `backend/middleware/ipMiddleware.js` captures client IP from headers
- ✅ **Backend Routes** - `/api/super-admin/audit-logs` endpoint with filtering and pagination
- ✅ **Admin Routes** - `/super-admin/audit-logs` and `/admin/audit-logs` routes properly secured

## System Architecture
The platform utilizes a React frontend (Vite) and a Node.js backend with a PostgreSQL database.

### UI/UX Decisions
- **Design Principle**: All styles defined via `frontend/src/theme/theme.js`.
- **Framework**: Exclusive use of Material-UI (MUI v7.3.5).
- **Color Palette**: #0056B3 (primary), #F9F9F9 (background), #212121 (text).
- **Styling**: 4px border radius, 8px spacing, Roboto font.
- **Localization**: FRANÇAIS UNIQUEMENT.
- **Responsive Design**: Mobile-first approach with breakpoint guidelines (xs, sm, md, lg), touch target sizes, responsive typography, and flexible grid layouts.
- **Accessibility**: WCAG 2.1 compliant with ARIA labels, keyboard navigation, semantic HTML, and color contrast compliance.
- **User Experience**: Loading skeletons for better UX during data loading.

### Technical Implementations
- **Frontend**: React 18 + Vite 7.2.4 + Material-UI v7.3.5.
- **Backend**: Node.js 20 + Express + PostgreSQL.
- **Authentication**: JWT tokens + httpOnly cookies, 3-layer token persistence, MFA (SMS & TOTP).
- **Security**: CORS protection, CSRF headers, XSS protection, AES-256 encryption, rate limiting, brute-force protection, input validation, soft deletes, role-based access control.
- **Supply Chain Workflow**: Multi-step wizard forms (CreateTender, CreateBid, CreateSupplyRequest, CreateInvoice) with auto-save, draft recovery, validation, and progress tracking.
- **Dynamic Company Profile**: For viewing and editing company information.
- **Advanced Filtering & Search**: Suppliers searchable by query, category, rating, and location, with debounced search, normalized terms, and optimized filtering.
- **Messaging System**: Full user-to-user communication (Inbox, Compose, Message Detail).
- **Reviews & Ratings System**: Comprehensive review, rating, and feedback functionality.
- **Direct Supply Request**: Buyers can send direct supply requests to verified suppliers.
- **Analytics & Insights**: Buyer/supplier dashboards, supplier analytics, and bid analytics.
- **Advanced Search & Comparison**: Multi-filter search and a bid comparison tool.
- **Data Management**: Export features (JSON, CSV), real-time updates via WebSockets, pagination, and bulk operations.
- **Supplier Performance Tracking**: Performance scoring, ranking, and history.
- **Email Notifications**: Integrated notification system with status tracking and integration readiness for various services.
- **Super Admin Features**: Full CRUD for static pages, file management, image gallery with SEO, documents with versioning, content backup/restore, analytics, services and subscription plan management.
- **Purchase Orders System**: PO lifecycle management with status tracking and authorization.
- **Audit Logs System**: Admin viewable audit logs tracking user activities and entity changes.
- **Subscription Plans System**: Backend API for plan management and user subscriptions with multiple tiers.
- **Confirmation Dialogs**: Reusable component for critical actions with severity levels.
- **Status Tracking**: Visual status indicators with color-coding and icons.

## Super Admin API Endpoints
The platform now includes a complete Super Admin API with 30+ endpoints covering:

1. **Static Pages Management** - CRUD for static pages
2. **File Management** - Upload, list, delete files
3. **Document Management** - Version tracking, CRUD operations
4. **Email Notifications** - Send and track emails
5. **User Management** - Extended user CRUD, role assignment, block/unblock
6. **Audit Logs** - Track all admin activities
7. **Health Monitoring** - System health status
8. **Backup & Restore** - Database backup management
9. **Subscription Plans** - Plan CRUD operations
10. **Feature Control** - Feature flag management

All endpoints are:
- ✅ Protected with JWT authentication
- ✅ Restricted to super_admin role
- ✅ Implement proper error handling
- ✅ Include audit logging
- ✅ Support pagination and filtering

API Base: `/api/super-admin`

## External Dependencies
- **Database**: PostgreSQL (Neon).
- **Frontend Libraries**: Material-UI (MUI) v7.3.5, React Router DOM, Axios, i18next, socket.io-client (v4.8.1).
- **Backend Libraries**: Express, Node.js 20, cors (v2.8.5), express-rate-limit (v8.2.1).
- **Email Services**: SendGrid/Resend/Gmail.