export type Status = "lead" | "active" | "paused" | "archived";
export type Priority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "backlog" | "planned" | "in_progress" | "review" | "done";
export type TaskStatus = "todo" | "in_progress" | "done";
export type FinanceKind = "income" | "expense";
export type VaultKind = "link" | "api_key" | "credential" | "note" | "snippet" | "doc";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: Status;
  tags: string[];
  revenue: number;
  lastContact: string;
  notes: string;
};

export type Project = {
  id: string;
  title: string;
  client: string;
  value: number;
  monthlyValue: number;
  contractMonths: number;
  status: ProjectStatus;
  priority: Priority;
  deadline: string;
  progress: number;
  labels: string[];
  comments: number;
  attachments: number;
  subtasks: number;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  status: TaskStatus;
  priority: Priority;
  due: string;
  reminder: string;
  checklist?: Array<{
    id: string;
    title: string;
    done: boolean;
  }>;
};

export type FinanceRecord = {
  id: string;
  kind: FinanceKind;
  title: string;
  amount: number;
  category: string;
  status: "paid" | "pending" | "scheduled";
  date: string;
};

export type VaultItem = {
  id: string;
  kind: VaultKind;
  title: string;
  value: string;
  tags: string[];
  updatedAt: string;
};

export type ActivityLog = {
  id: string;
  type: string;
  title: string;
  detail: string;
  createdAt: string;
};
