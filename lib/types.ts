export const PROJECT_STATUSES = ["Ideia", "Em andamento", "Em produção", "Concluído"] as const;
export const PAYMENT_STATUSES = ["Pago", "Pendente", "Atrasado", "Cancelado"] as const;
export const SNIPPET_CATEGORIES = ["Prompt", "Código", "Firebase", "Prisma", "Deploy", "Copy", "UI", "Config"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type SnippetCategory = (typeof SNIPPET_CATEGORIES)[number];

export type ProjectTimelineItem = {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
};

export type VaultProject = {
  id: string;
  name: string;
  client: string | null;
  description: string;
  status: string;
  stack: string;
  githubUrl: string | null;
  deployUrl: string | null;
  notes: string | null;
  favorite: boolean;
  projectValue: number | null;
  maintenanceActive: boolean;
  maintenanceValue: number | null;
  paymentStatus: string | null;
  nextPaymentDate: string | null;
  projectType: string | null;
  lastUpdate: string | null;
  problemsSolved: string | null;
  promptUsed: string | null;
  createdAt: string;
  updatedAt: string;
  timeline: ProjectTimelineItem[];
};

export type VaultSnippet = {
  id: string;
  title: string;
  content: string;
  category: string;
  tag: string | null;
  favorite: boolean;
  createdAt: string;
};
