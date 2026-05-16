import type { ActivityLog, Client, FinanceRecord, Project, Task, VaultItem } from "@/types/domain";

export const initialClients: Client[] = [
  {
    id: "cl_northstar",
    name: "Maya Chen",
    company: "Northstar Labs",
    email: "maya@northstar.dev",
    status: "active",
    tags: ["retainer", "product"],
    revenue: 42000,
    lastContact: "Today",
    notes: "Prefers compact weekly updates and async review packets.",
  },
  {
    id: "cl_arc",
    name: "Diego Ramos",
    company: "Arc Studio",
    email: "diego@arc.studio",
    status: "lead",
    tags: ["brand", "proposal"],
    revenue: 12000,
    lastContact: "May 14",
    notes: "Waiting on final scope confirmation.",
  },
  {
    id: "cl_vector",
    name: "Elena Novak",
    company: "Vector Works",
    email: "elena@vector.works",
    status: "paused",
    tags: ["ops", "automation"],
    revenue: 18500,
    lastContact: "May 10",
    notes: "Paused until Q3 budget is approved.",
  },
];

export const initialProjects: Project[] = [
  {
    id: "pr_atlas",
    title: "Atlas SaaS Foundation",
    client: "Internal",
    status: "in_progress",
    priority: "urgent",
    deadline: "2026-05-20",
    progress: 82,
    labels: ["product", "systems"],
    comments: 8,
    attachments: 4,
    subtasks: 12,
  },
  {
    id: "pr_creator",
    title: "Creator Launch Kit",
    client: "Northstar Labs",
    status: "review",
    priority: "high",
    deadline: "2026-05-24",
    progress: 64,
    labels: ["launch", "web"],
    comments: 5,
    attachments: 7,
    subtasks: 9,
  },
  {
    id: "pr_ops",
    title: "Retainer Ops Board",
    client: "Arc Studio",
    status: "planned",
    priority: "medium",
    deadline: "2026-06-02",
    progress: 28,
    labels: ["crm", "ops"],
    comments: 2,
    attachments: 1,
    subtasks: 6,
  },
  {
    id: "pr_finance",
    title: "Finance Command Center",
    client: "Personal",
    status: "backlog",
    priority: "medium",
    deadline: "2026-06-10",
    progress: 12,
    labels: ["finance"],
    comments: 1,
    attachments: 2,
    subtasks: 4,
  },
];

export const initialTasks: Task[] = [
  { id: "tk_1", title: "Send Northstar packet", projectId: "pr_creator", status: "todo", priority: "high", due: "Today", reminder: "09:30" },
  { id: "tk_2", title: "Close Supabase schema pass", projectId: "pr_atlas", status: "in_progress", priority: "urgent", due: "Today", reminder: "11:00" },
  { id: "tk_3", title: "Reconcile May expenses", status: "todo", priority: "medium", due: "Tomorrow", reminder: "14:00" },
  { id: "tk_4", title: "Archive old client credentials", status: "done", priority: "low", due: "May 13", reminder: "Done" },
];

export const initialFinances: FinanceRecord[] = [
  { id: "fn_1", kind: "income", title: "Northstar retainer", amount: 8200, category: "Retainer", status: "paid", date: "May 01" },
  { id: "fn_2", kind: "income", title: "Arc proposal deposit", amount: 3400, category: "Project", status: "pending", date: "May 18" },
  { id: "fn_3", kind: "expense", title: "Software subscriptions", amount: 640, category: "Tools", status: "paid", date: "May 05" },
  { id: "fn_4", kind: "expense", title: "Contractor design review", amount: 1200, category: "Contractors", status: "scheduled", date: "May 22" },
];

export const initialVault: VaultItem[] = [
  { id: "vl_1", kind: "api_key", title: "Supabase project", value: "••••••••••••••••", tags: ["infra", "prod"], updatedAt: "Today" },
  { id: "vl_2", kind: "credential", title: "Client staging login", value: "vault://arc/staging", tags: ["client", "staging"], updatedAt: "May 12" },
  { id: "vl_3", kind: "snippet", title: "Webhook signing helper", value: "verifyWebhookSignature()", tags: ["code"], updatedAt: "May 09" },
  { id: "vl_4", kind: "link", title: "Northstar design system", value: "https://northstar.dev/brand", tags: ["reference"], updatedAt: "May 08" },
];

export const initialActivities: ActivityLog[] = [
  { id: "ac_1", type: "project", title: "Atlas SaaS Foundation updated", detail: "Progress moved to 82%", createdAt: "6 minutes ago" },
  { id: "ac_2", type: "payment", title: "Northstar retainer marked paid", detail: "$8,200 added to May revenue", createdAt: "1 hour ago" },
  { id: "ac_3", type: "client", title: "Arc Studio moved to lead", detail: "Proposal follow-up scheduled", createdAt: "3 hours ago" },
  { id: "ac_4", type: "task", title: "Archive credentials completed", detail: "Secure vault reference updated", createdAt: "Yesterday" },
];
