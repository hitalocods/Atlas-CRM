import { Badge } from "@/components/ui/badge";
import type { Priority, ProjectStatus, Status } from "@/types/domain";

export function ClientStatusBadge({ status, label }: { status: Status; label?: string }) {
  const tone = status === "active" ? "success" : status === "lead" ? "warning" : "outline";
  return <Badge variant={tone}>{label ?? status}</Badge>;
}

export function PriorityBadge({ priority, label }: { priority: Priority; label?: string }) {
  const tone = priority === "urgent" || priority === "high" ? "warning" : "outline";
  return <Badge variant={tone}>{label ?? priority}</Badge>;
}

export function ProjectStatusBadge({ status, label }: { status: ProjectStatus; label?: string }) {
  const tone = status === "done" ? "success" : status === "review" || status === "in_progress" ? "warning" : "outline";
  return <Badge variant={tone}>{label ?? status.replace("_", " ")}</Badge>;
}
