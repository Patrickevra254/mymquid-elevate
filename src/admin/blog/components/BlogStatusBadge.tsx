import { cn } from "@/lib/utils";
import type { BlogStatus } from "../../types";

const config: Record<BlogStatus, { label: string; className: string }> = {
  published: { label: "Published", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

type Props = { status: BlogStatus };

export function BlogStatusBadge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  );
}
