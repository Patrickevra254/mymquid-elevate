import { cn } from "@/lib/utils";
import type { ModerationStatus } from "../../types";

const config: Record<ModerationStatus, { label: string; className: string }> = {
  pending:  { label: "Pending Review", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  approved: { label: "Approved",       className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { label: "Rejected",       className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

type Props = { status: ModerationStatus };

export function ModerationBadge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  );
}
