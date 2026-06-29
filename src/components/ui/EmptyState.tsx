import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export type EmptyStateProps = {
  message: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  message,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={[
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#f1c4d0]/70 bg-white/40 px-4 py-10 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="text-[#d36f8a]" aria-hidden="true">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <p className="text-sm font-semibold text-[#5b4a48]">{message}</p>
      {description ? (
        <p className="max-w-sm text-xs text-[#8a6f6c]">{description}</p>
      ) : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}