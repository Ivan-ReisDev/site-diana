import type { ReactNode } from "react";

export type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={[
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-1.5">
        <p className="invite-label">{eyebrow}</p>
        <h2 className="text-xl font-bold text-[#5b4a48] sm:text-2xl">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm text-[#8a6f6c]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}