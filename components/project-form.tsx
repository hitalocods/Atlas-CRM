import { createProjectAction, updateProjectAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_STATUSES, PROJECT_STATUSES, type VaultProject } from "@/lib/types";

type ProjectFormProps = {
  project?: VaultProject;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const action = project ? updateProjectAction : createProjectAction;
  const nextPaymentDate = project?.nextPaymentDate ? project.nextPaymentDate.slice(0, 10) : "";
  const lastUpdate = project?.lastUpdate ? project.lastUpdate.slice(0, 10) : "";

  return (
    <form action={action} className="grid gap-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" defaultValue={project?.name} required placeholder="Atlas Vault" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Input id="client" name="client" defaultValue={project?.client ?? ""} placeholder="Atlas" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição curta</Label>
        <Textarea id="description" name="description" defaultValue={project?.description} required placeholder="Resumo do projeto" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "Ideia"}
            className="h-10 w-full rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectType">Tipo</Label>
          <Input id="projectType" name="projectType" defaultValue={project?.projectType ?? "Web"} placeholder="Dashboard, Landing, App, Site" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stack">Stack</Label>
          <Input id="stack" name="stack" defaultValue={project?.stack} placeholder="Next.js, Prisma, Tailwind" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input id="githubUrl" name="githubUrl" defaultValue={project?.githubUrl ?? ""} placeholder="https://github.com/..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deployUrl">Deploy</Label>
          <Input id="deployUrl" name="deployUrl" defaultValue={project?.deployUrl ?? ""} placeholder="https://..." />
        </div>
      </div>

      <section className="rounded-lg border border-border bg-background/30 p-4">
        <h4 className="mb-4 text-sm font-medium">Financeiro</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="projectValue">Valor do projeto</Label>
            <Input id="projectValue" name="projectValue" defaultValue={project?.projectValue ?? ""} placeholder="1500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maintenanceValue">Valor mensal</Label>
            <Input id="maintenanceValue" name="maintenanceValue" defaultValue={project?.maintenanceValue ?? ""} placeholder="150" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentStatus">Status pagamento</Label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              defaultValue={project?.paymentStatus ?? "Pendente"}
              className="h-10 w-full rounded-md border border-input bg-background/55 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextPaymentDate">Próximo vencimento</Label>
            <Input id="nextPaymentDate" name="nextPaymentDate" type="date" defaultValue={nextPaymentDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastUpdate">Última atualização</Label>
            <Input id="lastUpdate" name="lastUpdate" type="date" defaultValue={lastUpdate} />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <input name="maintenanceActive" type="checkbox" defaultChecked={project?.maintenanceActive} className="h-4 w-4 accent-primary" />
          Manutenção ativa
        </label>
      </section>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" name="notes" defaultValue={project?.notes ?? ""} placeholder="Decisões, links úteis, próximos passos" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promptUsed">Prompt usado</Label>
        <Textarea id="promptUsed" name="promptUsed" defaultValue={project?.promptUsed ?? ""} placeholder="Prompt Codex, landing, dashboard ou IA usado no projeto" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problemsSolved">Problemas resolvidos</Label>
        <Textarea id="problemsSolved" name="problemsSolved" defaultValue={project?.problemsSolved ?? ""} placeholder="realtime reservas, multi-tenant, auth, upload imagens" />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input name="favorite" type="checkbox" defaultChecked={project?.favorite} className="h-4 w-4 accent-primary" />
        Favorito
      </label>

      <Button type="submit" className="justify-self-end">
        {project ? "Salvar alterações" : "Criar projeto"}
      </Button>
    </form>
  );
}
