import { Badge } from "@/components/ui/badge";
import type { Priority, ProjectStatus, Status } from "@/types/domain";

export function ClientStatusBadge({ status }: { status: Status }) {
  const tone = status === "active" ? "success" : status === "lead" ? "warning" : "outline";
  return <Badge variant={tone}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone = priority === "urgent" || priority === "high" ? "warning" : "outline";
  return <Badge variant={tone}>{priority}</Badge>;
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const tone = status === "done" ? "success" : status === "review" || status === "in_progress" ? "warning" : "outline";
  return <Badge variant={tone}>{status.replace("_", " ")}</Badge>;
}
