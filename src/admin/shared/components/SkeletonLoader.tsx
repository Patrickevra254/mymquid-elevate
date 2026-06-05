import { cn } from "@/lib/utils";

type Props = { rows?: number; className?: string };

export function SkeletonLoader({ rows = 4, className }: Props) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 rounded-md bg-muted animate-pulse"
          style={{ width: `${85 + (i % 3) * 5}%` }}
        />
      ))}
    </div>
  );
}
