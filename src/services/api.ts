import { environment } from '../config/environment';
import type {
  AboutPayload,
  ApiEnvelope,
  AgendaPayload,
  BootstrapPayload,
  CustomersPayload,
  DashboardPayload,
  FreightAdjustmentsPayload,
  HelpPayload,
  IssueDetailPayload,
  IssuesPayload,
  NotificationsPayload,
  ProfilePayload,
  SettingsPayload,
  VisitDetail,
  VisitSummary,
} from '../types/mobile';

type RequestOptions = {
  method?: 'GET' | 'POST';
  token?: string | null;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), environment.requestTimeoutMs);

  try {
    const response = await fetch(`${environment.apiBaseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const payload = await response.json();
    if (!response.ok || payload.ok === false) {
      throw new Error(payload?.error?.message ?? 'Erro ao comunicar com a API mobile.');
    }

    return payload.data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  async login(login: string, senha: string): Promise<{
    user: BootstrapPayload['user'];
    auth: { access_token: string; token_type: string; expires_at: string };
    bootstrap: BootstrapPayload;
  }> {
    return request('/api/mobile/auth/login', {
      method: 'POST',
      body: { login, senha },
    });
  },

  async session(token: string): Promise<ApiEnvelope<{ authenticated: true }>> {
    const response = await fetch(`${environment.apiBaseUrl}/api/mobile/auth/session`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async bootstrap(token: string): Promise<BootstrapPayload> {
    return request('/api/mobile/bootstrap', { token });
  },

  async dashboard(token: string): Promise<DashboardPayload> {
    return request('/api/mobile/dashboard', { token });
  },

  async visits(token: string): Promise<{ items: VisitSummary[] }> {
    return request('/api/mobile/visits', { token });
  },

  async visitDetail(token: string, id: number): Promise<{ item: VisitDetail }> {
    return request(`/api/mobile/visits/show?id=${id}`, { token });
  },

  async profile(token: string): Promise<ProfilePayload> {
    return request('/api/mobile/profile', { token });
  },

  async settings(token: string): Promise<SettingsPayload> {
    return request('/api/mobile/settings', { token });
  },

  async help(token: string): Promise<HelpPayload> {
    return request('/api/mobile/help', { token });
  },

  async about(token: string): Promise<AboutPayload> {
    return request('/api/mobile/about', { token });
  },

  async notifications(token: string): Promise<NotificationsPayload> {
    return request('/api/mobile/notifications', { token });
  },

  async notificationRead(token: string, id: number): Promise<{ updated: boolean }> {
    return request('/api/mobile/notifications/read', {
      method: 'POST',
      token,
      body: { id },
    });
  },

  async notificationReadAll(token: string): Promise<{ updated: number }> {
    return request('/api/mobile/notifications/read-all', {
      method: 'POST',
      token,
      body: {},
    });
  },

  async agenda(token: string, params?: { month?: number; year?: number; criteria?: string }): Promise<AgendaPayload> {
    const query = new URLSearchParams();
    if (params?.month) query.set('month', String(params.month));
    if (params?.year) query.set('year', String(params.year));
    if (params?.criteria) query.set('criteria', params.criteria);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/mobile/agenda${suffix}`, { token });
  },

  async scheduleAgenda(token: string, payload: { month: number; year: number; criteria: string; date?: string }): Promise<{
    result: { criados: number; ignorados: number };
  }> {
    return request('/api/mobile/agenda/schedule', {
      method: 'POST',
      token,
      body: payload,
    });
  },

  async customers(token: string, params?: { q?: string; page?: number }): Promise<CustomersPayload> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.page) query.set('page', String(params.page));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/mobile/customers${suffix}`, { token });
  },

  async issues(token: string, params?: { q?: string; status?: string }): Promise<IssuesPayload> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.status) query.set('status', params.status);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/mobile/issues${suffix}`, { token });
  },

  async issueDetail(token: string, id: number): Promise<{ item: IssueDetailPayload }> {
    return request(`/api/mobile/issues/show?id=${id}`, { token });
  },

  async freightAdjustments(token: string, params?: { q?: string; status?: string }): Promise<FreightAdjustmentsPayload> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.status) query.set('status', params.status);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/mobile/freight-adjustments${suffix}`, { token });
  },

  async logout(token: string | null): Promise<void> {
    if (!token) {
      return;
    }

    await request('/api/mobile/auth/logout', {
      method: 'POST',
      token,
    });
  },
};
