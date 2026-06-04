import { getPrisma } from "@/lib/prisma";
import { VaultShell } from "@/components/vault-shell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const prisma = getPrisma();
  const [projects, snippets] = await Promise.all([
    prisma.project.findMany({
      include: { timeline: { orderBy: { createdAt: "asc" } } },
      orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.snippet.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <VaultShell
      projects={projects.map((project) => ({
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        nextPaymentDate: project.nextPaymentDate?.toISOString() ?? null,
        lastUpdate: project.lastUpdate?.toISOString() ?? null,
        timeline: project.timeline.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        })),
      }))}
      snippets={snippets.map((snippet) => ({
        ...snippet,
        createdAt: snippet.createdAt.toISOString(),
      }))}
    />
  );
}
