import { Activity, CircleDot, CreditCard, FolderKanban, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityLog } from "@/types/domain";

const iconMap = {
  project: FolderKanban,
  payment: CreditCard,
  client: UserRound,
  task: CircleDot,
  system: Activity,
};

export function ActivityTimeline({ activities, title = "Activity" }: { activities: ActivityLog[]; title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Recent operational movement across Atlas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type as keyof typeof iconMap] ?? Activity;

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-0.5 grid size-7 place-items-center rounded-md border border-border bg-secondary">
                <Icon className="size-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{activity.title}</div>
                <div className="truncate text-xs text-muted-foreground">{activity.detail}</div>
              </div>
              <div className="whitespace-nowrap font-mono text-[10px] text-muted-foreground">{activity.createdAt}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
