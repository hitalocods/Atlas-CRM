import { CircleDashed } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>This module shell is reserved for the next Atlas feature layer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
            <div className="text-center">
              <CircleDashed className="mx-auto mb-3 size-6 text-muted-foreground" />
              <div className="text-sm font-medium">No records yet</div>
              <div className="mt-1 text-xs text-muted-foreground">The architecture is ready for production data.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
