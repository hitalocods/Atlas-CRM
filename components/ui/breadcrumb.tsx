import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol className={cn("flex flex-wrap items-center gap-1.5 break-words text-xs text-muted-foreground", className)} {...props} />;
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

export function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return <Comp className={cn("transition-colors hover:text-foreground", className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-current="page" className={cn("font-medium text-foreground", className)} {...props} />;
}

export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3", className)} {...props}>
      {children ?? <ChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span role="presentation" aria-hidden="true" className={cn("flex size-5 items-center justify-center", className)} {...props}>
      <MoreHorizontal className="size-3.5" />
      <span className="sr-only">More</span>
    </span>
  );
}
