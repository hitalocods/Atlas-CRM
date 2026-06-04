"use client";

import Image from "next/image";
import { useState } from "react";
import { getProjectImage, PROJECT_IMAGE_FALLBACK, type ProjectImageName } from "@/lib/project-images";
import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  projectName: string;
  image?: ProjectImageName;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ProjectCover({
  projectName,
  image = "cover",
  alt,
  className,
  sizes = "(min-width: 1536px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: ProjectCoverProps) {
  const generatedSrc = getProjectImage(projectName, image);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = failedSrc === generatedSrc ? PROJECT_IMAGE_FALLBACK : generatedSrc;

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)}>
      <Image
        src={src}
        alt={alt ?? `Imagem do projeto ${projectName}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition duration-500 group-hover:scale-[1.035]"
        onError={() => {
          if (src !== PROJECT_IMAGE_FALLBACK) {
            setFailedSrc(generatedSrc);
          }
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/45 via-background/5 to-transparent opacity-70 transition duration-300 group-hover:opacity-40" />
    </div>
  );
}
