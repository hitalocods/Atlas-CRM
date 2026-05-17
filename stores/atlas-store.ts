"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  initialActivities,
  initialClients,
  initialFinances,
  initialProjects,
  initialTasks,
  initialVault,
} from "@/lib/atlas-data";
import type { ActivityLog, Client, FinanceRecord, Project, ProjectStatus, Task, VaultItem } from "@/types/domain";

type AtlasState = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  finances: FinanceRecord[];
  vault: VaultItem[];
  activities: ActivityLog[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  moveProject: (id: string, status: ProjectStatus) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  addFinance: (record: FinanceRecord) => void;
  addVaultItem: (item: VaultItem) => void;
  logActivity: (activity: Omit<ActivityLog, "id" | "createdAt">) => void;
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useAtlasStore = create<AtlasState>()(
  persist(
    (set) => ({
      clients: initialClients,
      projects: initialProjects,
      tasks: initialTasks,
      finances: initialFinances,
      vault: initialVault,
      activities: initialActivities,
      addClient: (client) =>
        set((state) => ({
          clients: [client, ...state.clients],
          activities: [{ id: id("ac"), type: "client", title: `${client.company} created`, detail: "New CRM record added", createdAt: "Just now" }, ...state.activities],
        })),
      updateClient: (client) =>
        set((state) => ({
          clients: state.clients.map((item) => (item.id === client.id ? client : item)),
          activities: [{ id: id("ac"), type: "client", title: `${client.company} updated`, detail: "Client record changed", createdAt: "Just now" }, ...state.activities],
        })),
      removeClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId),
          activities: [{ id: id("ac"), type: "client", title: "Client archived", detail: "CRM record removed from active view", createdAt: "Just now" }, ...state.activities],
        })),
      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
          activities: [{ id: id("ac"), type: "project", title: `${project.title} created`, detail: "Project added to board", createdAt: "Just now" }, ...state.activities],
        })),
      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((item) => (item.id === project.id ? project : item)),
          activities: [{ id: id("ac"), type: "project", title: `${project.title} updated`, detail: "Project record changed", createdAt: "Just now" }, ...state.activities],
        })),
      moveProject: (projectId, status) =>
        set((state) => ({
          projects: state.projects.map((project) => (project.id === projectId ? { ...project, status } : project)),
          activities: [{ id: id("ac"), type: "project", title: "Project status changed", detail: `Moved to ${status.replace("_", " ")}`, createdAt: "Just now" }, ...state.activities],
        })),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (task) => set((state) => ({ tasks: state.tasks.map((item) => (item.id === task.id ? task : item)) })),
      addFinance: (record) => set((state) => ({ finances: [record, ...state.finances] })),
      addVaultItem: (item) => set((state) => ({ vault: [item, ...state.vault] })),
      logActivity: (activity) =>
        set((state) => ({ activities: [{ id: id("ac"), createdAt: "Just now", ...activity }, ...state.activities] })),
    }),
    {
      name: "atlas-store",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AtlasState>;
        const tasks = (state.tasks ?? initialTasks).map((task) => {
          const seededTask = initialTasks.find((item) => item.id === task.id);

          return {
            ...task,
            description: task.description ?? seededTask?.description ?? "",
            checklist: task.checklist ?? seededTask?.checklist ?? [],
          };
        });

        return { ...state, tasks };
      },
    },
  ),
);
