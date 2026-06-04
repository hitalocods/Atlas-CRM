"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { PAYMENT_STATUSES, PROJECT_STATUSES, SNIPPET_CATEGORIES } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function normalizeStatus(value: string) {
  return PROJECT_STATUSES.includes(value as never) ? value : "Ideia";
}

function normalizePaymentStatus(value: string) {
  return PAYMENT_STATUSES.includes(value as never) ? value : "Pendente";
}

function normalizeSnippetCategory(value: string) {
  return SNIPPET_CATEGORIES.includes(value as never) ? value : "Código";
}

function normalizeStack(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function moneyValue(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const amount = Number.parseFloat(normalized);

  return Number.isFinite(amount) ? amount : null;
}

function optionalDate(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? new Date(`${value}T12:00:00`) : null;
}

export async function createProjectAction(formData: FormData) {
  const prisma = getPrisma();

  await prisma.project.create({
    data: {
      name: text(formData, "name"),
      client: optionalText(formData, "client"),
      description: text(formData, "description"),
      status: normalizeStatus(text(formData, "status")),
      stack: normalizeStack(text(formData, "stack")),
      githubUrl: optionalText(formData, "githubUrl"),
      deployUrl: optionalText(formData, "deployUrl"),
      notes: optionalText(formData, "notes"),
      promptUsed: optionalText(formData, "promptUsed"),
      problemsSolved: optionalText(formData, "problemsSolved"),
      projectValue: moneyValue(text(formData, "projectValue")),
      maintenanceActive: formData.get("maintenanceActive") === "on",
      maintenanceValue: moneyValue(text(formData, "maintenanceValue")),
      paymentStatus: normalizePaymentStatus(text(formData, "paymentStatus")),
      nextPaymentDate: optionalDate(formData, "nextPaymentDate"),
      projectType: optionalText(formData, "projectType") ?? "Web",
      lastUpdate: optionalDate(formData, "lastUpdate"),
      favorite: formData.get("favorite") === "on",
    },
  });

  revalidatePath("/");
}

export async function updateProjectAction(formData: FormData) {
  const prisma = getPrisma();
  const id = text(formData, "id");

  await prisma.project.update({
    where: { id },
    data: {
      name: text(formData, "name"),
      client: optionalText(formData, "client"),
      description: text(formData, "description"),
      status: normalizeStatus(text(formData, "status")),
      stack: normalizeStack(text(formData, "stack")),
      githubUrl: optionalText(formData, "githubUrl"),
      deployUrl: optionalText(formData, "deployUrl"),
      notes: optionalText(formData, "notes"),
      promptUsed: optionalText(formData, "promptUsed"),
      problemsSolved: optionalText(formData, "problemsSolved"),
      projectValue: moneyValue(text(formData, "projectValue")),
      maintenanceActive: formData.get("maintenanceActive") === "on",
      maintenanceValue: moneyValue(text(formData, "maintenanceValue")),
      paymentStatus: normalizePaymentStatus(text(formData, "paymentStatus")),
      nextPaymentDate: optionalDate(formData, "nextPaymentDate"),
      projectType: optionalText(formData, "projectType") ?? "Web",
      lastUpdate: optionalDate(formData, "lastUpdate"),
      favorite: formData.get("favorite") === "on",
    },
  });

  revalidatePath("/");
}

export async function deleteProjectAction(formData: FormData) {
  const prisma = getPrisma();
  const id = text(formData, "id");

  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleFavoriteAction(formData: FormData) {
  const prisma = getPrisma();
  const id = text(formData, "id");
  const favorite = formData.get("favorite") === "true";

  await prisma.project.update({
    where: { id },
    data: { favorite: !favorite },
  });

  revalidatePath("/");
}

export async function createSnippetAction(formData: FormData) {
  const prisma = getPrisma();

  await prisma.snippet.create({
    data: {
      title: text(formData, "title"),
      content: text(formData, "content"),
      category: normalizeSnippetCategory(text(formData, "category")),
      tag: optionalText(formData, "tag"),
      favorite: formData.get("favorite") === "on",
    },
  });

  revalidatePath("/");
}

export async function deleteSnippetAction(formData: FormData) {
  const prisma = getPrisma();
  const id = text(formData, "id");

  await prisma.snippet.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleSnippetFavoriteAction(formData: FormData) {
  const prisma = getPrisma();
  const id = text(formData, "id");
  const favorite = formData.get("favorite") === "true";

  await prisma.snippet.update({
    where: { id },
    data: { favorite: !favorite },
  });

  revalidatePath("/");
}
