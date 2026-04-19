export type MobileUser = {
  id: number;
  nome: string;
  login: string;
  tipo_usuario: string;
  cargo: string;
  subcargo: string;
  filial: string;
};

export type BrandingPayload = {
  system_name: string;
  company_name: string;
  company_slug: string;
  logo_path: string;
  favicon_path: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  screen: string;
  enabled: boolean;
  implemented: boolean;
  web_route?: string;
};

export type NavigationSection = {
  id: string;
  title: string;
  items: NavigationItem[];
};

export type BootstrapPayload = {
  user: MobileUser;
  branding: BrandingPayload;
  navigation: {
    default_route: string;
    sections: NavigationSection[];
  };
  features: {
    offline_cache: boolean;
    retry_queue: boolean;
    secure_session: boolean;
  };
  app: {
    name: string;
    bundle_id: string;
    support_email: string;
    support_whatsapp: string;
    help_url: string;
    privacy_url: string;
  };
};

export type ApiEnvelope<T> = {
  ok: boolean;
  data: T;
  meta: {
    timestamp: string;
  };
};

export type DashboardPayload = {
  metrics: Array<{
    label: string;
    value: number;
    tone: string;
  }>;
  highlights: {
    realizadas: number;
    pendentes: number;
    atrasadas: number;
  };
  upcoming_visits: VisitSummary[];
  notifications: Array<{
    id: number;
    mensagem: string;
    lida: number;
    data_criacao: string;
  }>;
};

export type VisitSummary = {
  id: number;
  id_cliente: number;
  id_vendedor: number;
  data_visita: string;
  hora_visita: string;
  status: string;
  objetivo: string;
  cliente_nome: string;
  vendedor_nome: string;
};

export type VisitDetail = VisitSummary & {
  cnpj_cpf?: string;
  endereco?: string;
  observacoes?: string;
};

export type ProfilePayload = {
  user: MobileUser;
  account: {
    login: string;
    role: string;
    branch: string;
    cargo: string;
    subcargo: string;
  };
};

export type SettingsPayload = {
  toggles: Array<{
    key: string;
    label: string;
    enabled: boolean;
  }>;
  limits: {
    api_timeout_seconds: number;
    retry_attempts: number;
  };
};

export type HelpPayload = {
  contact: {
    email: string;
    whatsapp: string;
    help_url: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export type AboutPayload = {
  name: string;
  description: string;
  company: {
    system_name: string;
    company_name: string;
    company_slug: string;
  };
  privacy: {
    collects: string[];
    does_not_collect: string[];
  };
};

export type NotificationItem = {
  id: number;
  mensagem: string;
  lida: number;
  data_criacao: string;
  data_leitura?: string | null;
};

export type NotificationsPayload = {
  items: NotificationItem[];
  summary: {
    total: number;
    unread: number;
  };
};

export type AgendaDay = {
  date: string;
  count: number;
  items: Array<{
    id: number;
    nome: string;
    endereco: string;
    filial: string;
    ultima_visita: string | null;
    dias_sem_visita: number | null;
    latitude: number;
    longitude: number;
    regiao: string;
    faturamento_recente: number;
    faturamento_historico: number;
    dias_sem_faturamento: number;
  }>;
};

export type AgendaPayload = {
  seller: MobileUser | null;
  filters: {
    seller_id: number;
    month: number;
    year: number;
    criteria: string;
  };
  days: AgendaDay[];
};

export type CustomersPayload = {
  items: Array<{
    id: number;
    nome: string;
    cnpj_cpf: string;
    endereco: string;
    filial: string;
    id_vendedor_responsavel: number;
    vendedor_nome: string;
  }>;
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
};

export type IssuesPayload = {
  items: Array<{
    id: number;
    protocolo: string;
    tipo: string;
    status: string;
    descricao: string;
    criado_em: string;
    cliente_nome: string;
    supervisor_nome: string;
    responsavel_nome: string;
  }>;
  summary: {
    total: number;
  };
};

export type IssueDetailPayload = {
  issue: {
    id: number;
    protocolo: string;
    tipo: string;
    status: string;
    descricao: string;
    criado_em: string;
    cliente_nome: string;
    supervisor_nome: string;
    abertura_nome: string;
    responsavel_nome: string;
  };
  history: Array<{
    criado_em: string;
    acao: string;
    detalhes: string;
    usuario_nome: string;
  }>;
};

export type FreightAdjustmentsPayload = {
  items: Array<{
    id: number;
    status: string;
    tipo_solicitacao: string;
    motivo: string;
    data_solicitacao: string;
    data_vencimento?: string | null;
    cliente_nome: string;
    cliente_filial: string;
    vendedor_nome?: string | null;
    gerente_nome?: string | null;
    analista_nome?: string | null;
    supervisor_nome?: string | null;
  }>;
  summary: {
    total: number;
  };
};
