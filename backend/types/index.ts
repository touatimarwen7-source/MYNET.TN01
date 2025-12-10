
/**
 * 🔷 MyNet.tn TypeScript Definitions
 * Centralized type definitions for gradual migration
 */

// ============================================
// USER TYPES
// ============================================
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
  password_salt?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  company_name?: string;
  company_registration?: string;
  is_verified: boolean;
  is_active: boolean;
  last_login?: Date;
  mfa_enabled: boolean;
  mfa_secret?: string;
  average_rating: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export type UserRole = 'super_admin' | 'admin' | 'buyer' | 'supplier';

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  company_name?: string;
  company_registration?: string;
}

// ============================================
// TENDER TYPES
// ============================================
export interface Tender {
  id: number;
  tender_number: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  currency: string;
  status: TenderStatus;
  publish_date?: Date;
  deadline: Date;
  opening_date: Date;
  requirements?: any;
  attachments?: any[];
  buyer_id: number;
  is_public: boolean;
  evaluation_criteria?: any;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export type TenderStatus = 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';

export interface CreateTenderDTO {
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  currency?: string;
  deadline: Date;
  opening_date: Date;
  requirements?: any;
  attachments?: any[];
  is_public?: boolean;
  evaluation_criteria?: any;
}

// ============================================
// OFFER TYPES
// ============================================
export interface Offer {
  id: number;
  tender_id: number;
  supplier_id: number;
  offer_number: string;
  total_amount: number;
  currency: string;
  delivery_time: string;
  payment_terms?: string;
  technical_proposal?: string;
  financial_proposal?: string;
  attachments?: any[];
  status: OfferStatus;
  evaluation_score?: number;
  evaluation_notes?: string;
  submitted_at: Date;
  is_winner: boolean;
  encrypted_data?: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export type OfferStatus = 'submitted' | 'evaluated' | 'accepted' | 'rejected' | 'awarded';

export interface CreateOfferDTO {
  tender_id: number;
  total_amount: number;
  currency?: string;
  delivery_time: string;
  payment_terms?: string;
  technical_proposal?: string;
  financial_proposal?: string;
  attachments?: any[];
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// SERVICE TYPES
// ============================================
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface TenderFilters {
  status?: TenderStatus;
  category?: string;
  is_public?: boolean;
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// ============================================
// AUTHENTICATION TYPES
// ============================================
export interface AuthPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: Omit<User, 'password_hash' | 'password_salt'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
