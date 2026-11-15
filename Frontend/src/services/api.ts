/**
 * CareerTrack BD — API Client
 * All endpoints map to the FastAPI backend at /api/v1/*
 * Backend routes use "items" (fastapi-struct naming) for job applications.
 */

import {
  JobApplication,
  ApplicationCreatePayload,
  ApplicationUpdatePayload,
  ApplicationListResponse,
  DashboardStats,
  AuthUser,
  AuthResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export interface FilterParams {
  search?: string;
  status?: string;
  organization?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ExaminationItem {
  id: number;
  item_id: number;
  exam_type: string;
  exam_date?: string;
  start_time?: string;
  end_time?: string;
  reporting_time?: string;
  center_name?: string;
  center_address?: string;
  status: string;
  schedule_status: string;
  verified: boolean;
  source_notice_ref?: string;
}

export interface SeatPlanCentre {
  centre_no: number;
  name: string;
  area: string;
  roll_from: number;
  roll_to: number;
  sl?: number;
  address?: string;
  start_roll?: number;
  end_roll?: number;
  total?: number;
}

export type CenterInfo = SeatPlanCentre;

export interface SeatPlanResponse {
  exam_date?: string;
  exam_time?: string;
  report_by?: string;
  total_candidates?: number;
  total_centres?: number;
  notice?: string;
  centres?: SeatPlanCentre[];
  centers?: SeatPlanCentre[];
  // Roll-specific lookup fields
  roll?: number;
  matched?: boolean;
  centre?: SeatPlanCentre;
  matched_center?: SeatPlanCentre;
  message?: string;
}

export type SeniorOfficerCenterResponse = SeatPlanResponse & {
  centers: SeatPlanCentre[];
};

export interface NotificationItem {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  target_date?: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  model: string;
  tokens_used?: number;
  sources?: string[];
  suggested_actions?: string[];
}

export interface RAGResponse {
  answer: string;
  retrieved_documents: { id: string; title: string; content: string; score: number }[];
  query: string;
}

export interface PredictResponse {
  label: string;
  label_human: string;
  confidence: number;
  confidence_tier: string;
  action: string;
  extracted: Record<string, any>;
  latency_ms: number;
  model_device: string;
}

// ── Core request helper ───────────────────────────────────────────────────────
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('careertrack_auth_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorDetail = `Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (typeof errJson.detail === 'string') {
        errorDetail = errJson.detail;
      } else if (Array.isArray(errJson.detail)) {
        errorDetail = errJson.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(', ');
      } else if (typeof errJson.message === 'string') {
        errorDetail = errJson.message;
      } else {
        errorDetail = JSON.stringify(errJson);
      }
    } catch {
      // keep default
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// ── API surface ───────────────────────────────────────────────────────────────
export const api = {

  // ── Health ────────────────────────────────────────────────────────────────
  health: () => request<{ status: string; version: string }>('/health'),

  // ── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats: (): Promise<DashboardStats> =>
    request<DashboardStats>('/items/stats'),

  // ── Meta ──────────────────────────────────────────────────────────────────
  getOrganizations: async (): Promise<string[]> => {
    const res = await request<{ organizations: string[] }>('/items/meta/organizations');
    return res.organizations;
  },

  // ── Applications (Items) ──────────────────────────────────────────────────
  getApplications: (params: FilterParams = {}): Promise<ApplicationListResponse> => {
    const query = new URLSearchParams();
    if (params.search)                            query.append('search', params.search);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.organization && params.organization !== 'All')
                                                  query.append('organization', params.organization);
    if (params.page)                              query.append('page', params.page.toString());
    if (params.page_size)                         query.append('page_size', params.page_size.toString());
    if (params.sort_by)                           query.append('sort_by', params.sort_by);
    if (params.sort_order)                        query.append('sort_order', params.sort_order);
    const qs = query.toString();
    return request<ApplicationListResponse>(`/items${qs ? `?${qs}` : ''}`);
  },

  getApplication: (id: number): Promise<JobApplication> =>
    request<JobApplication>(`/items/${id}`),

  createApplication: (payload: ApplicationCreatePayload): Promise<JobApplication> =>
    request<JobApplication>('/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateApplication: (id: number, payload: ApplicationUpdatePayload): Promise<JobApplication> =>
    request<JobApplication>(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteApplication: (id: number): Promise<void> =>
    request<void>(`/items/${id}`, { method: 'DELETE' }),

  attachPdf: (id: number, file: File, pdfType: 'submit_pdf' | 'admit_pdf' | 'seat_plan_pdf'): Promise<JobApplication> => {
    const fd = new FormData();
    fd.append('file', file);
    return request<JobApplication>(`/items/${id}/attach-pdf?pdf_type=${pdfType}`, {
      method: 'POST',
      body: fd,
    });
  },

  // ── Seat Plan ─────────────────────────────────────────────────────────────
  getSeatPlan: (roll?: number): Promise<SeatPlanResponse> => {
    const query = roll ? `?roll=${roll}` : '';
    return request<SeatPlanResponse>(`/items/seat-plan${query}`);
  },

  getSeniorOfficerCenters: async (roll?: number): Promise<SeniorOfficerCenterResponse> => {
    const res = await api.getSeatPlan(roll);
    const rawList = res.centres || res.centers || [];
    const normalizedCentres = rawList.map((c: any, idx: number) => ({
      ...c,
      sl: c.centre_no || idx + 1,
      address: c.area || c.address || '',
      start_roll: c.roll_from || c.start_roll || 0,
      end_roll: c.roll_to || c.end_roll || 0,
      total: c.total || (c.roll_to && c.roll_from ? c.roll_to - c.roll_from + 1 : 0),
    }));
    
    let matchedCenter: SeatPlanCentre | undefined = res.centre || res.matched_center ? {
      centre_no: (res.centre || res.matched_center)?.centre_no || 1,
      name: (res.centre || res.matched_center)?.name || '',
      area: (res.centre || res.matched_center)?.area || '',
      roll_from: (res.centre || res.matched_center)?.roll_from || 0,
      roll_to: (res.centre || res.matched_center)?.roll_to || 0,
      sl: (res.centre || res.matched_center)?.centre_no || 1,
      address: (res.centre || res.matched_center)?.area || (res.centre || res.matched_center)?.address || '',
      start_roll: (res.centre || res.matched_center)?.roll_from || (res.centre || res.matched_center)?.start_roll || 0,
      end_roll: (res.centre || res.matched_center)?.roll_to || (res.centre || res.matched_center)?.end_roll || 0,
      total: (res.centre || res.matched_center)?.total || 0,
    } : undefined;

    if (!matchedCenter && roll) {
      matchedCenter = normalizedCentres.find(
        (c: any) => c.start_roll <= roll && roll <= c.end_roll
      );
    }

    return {
      ...res,
      centers: normalizedCentres,
      matched_center: matchedCenter,
    };
  },

  // ── AI Chat ───────────────────────────────────────────────────────────────
  chatWithAssistant: (messages: string | ChatMessage[], sessionId = ''): Promise<ChatResponse> => {
    const payload = typeof messages === 'string'
      ? [{ role: 'user' as const, content: messages }]
      : messages;
    return request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: payload, session_id: sessionId }),
    });
  },

  // ── RAG ───────────────────────────────────────────────────────────────────
  ragQuery: (query: string, top_k = 3): Promise<RAGResponse> =>
    request<RAGResponse>('/rag/query', {
      method: 'POST',
      body: JSON.stringify({ query, top_k }),
    }),

  // ── ML Document Classification ────────────────────────────────────────────
  predictDocument: (text: string): Promise<PredictResponse> =>
    request<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  // ── Notifications (served from seeded DB via items context) ───────────────
  getNotifications: (): Promise<NotificationItem[]> => {
    // Notifications are stored in DB; return empty list gracefully if endpoint missing
    return request<NotificationItem[]>('/notifications').catch(() => []);
  },

  // ── Documents (upload + predict) ──────────────────────────────────────────
  getDocuments: (): Promise<any[]> =>
    request<any[]>('/documents').catch(() => []),

  extractDocument: async (payload?: FormData | string): Promise<any> => {
    if (payload instanceof FormData) {
      const url = `${API_BASE_URL}/documents/extract`;
      const response = await fetch(url, {
        method: 'POST',
        body: payload,
      });
      if (!response.ok) {
        let errorDetail = `Error ${response.status}: ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (typeof errJson.detail === 'string') {
            errorDetail = errJson.detail;
          } else if (Array.isArray(errJson.detail)) {
            errorDetail = errJson.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(', ');
          } else if (typeof errJson.message === 'string') {
            errorDetail = errJson.message;
          } else {
            errorDetail = JSON.stringify(errJson);
          }
        } catch {}
        throw new Error(errorDetail);
      }
      return response.json();
    }

    const text = typeof payload === 'string' ? payload : '';
    return request<any>('/documents/extract', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // ── Database Reset / Clean ────────────────────────────────────────────────
  cleanDatabase: (): Promise<{ status: string; message: string }> =>
    request<{ status: string; message: string }>('/items/clean', { method: 'POST' }),

  cleanDocuments: (): Promise<{ status: string; message: string }> =>
    request<{ status: string; message: string }>('/documents/clean', { method: 'POST' }),

  // ── Authentication & OAuth2 OTP ──────────────────────────────────────────
  signup: (payload: { full_name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyOtp: (payload: { email: string; otp: string; purpose: 'signup' | 'login' }): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  resendOtp: (payload: { email: string; purpose: 'signup' | 'login' | 'password_reset' }): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string): Promise<AuthResponse> =>
    request<AuthResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload: { email: string; otp: string; new_password: string }): Promise<{ status: string; message: string; email: string }> =>
    request<{ status: string; message: string; email: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: (): Promise<{ authenticated: boolean; user: AuthUser | null }> =>
    request<{ authenticated: boolean; user: AuthUser | null }>('/auth/me'),

  logout: async (): Promise<void> => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('careertrack_auth_token');
    }
  },
};
