import Image from "next/image";
import { cn } from "@/lib/utils";

export function AtlasLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative size-8 overflow-hidden rounded-md border border-border bg-background shadow-sm", className)}>
      <Image
        src="/img/logobalack.png"
        alt="Atlas"
        fill
        sizes="32px"
        className="object-contain p-1 dark:hidden"
        priority
      />
      <Image
        src="/img/logowhite.png"
        alt="Atlas"
        fill
        sizes="32px"
        className="hidden object-contain p-1 dark:block"
        priority
      />
    </div>
  );
}
