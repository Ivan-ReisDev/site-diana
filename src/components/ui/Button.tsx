import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  block?: boolean;
  children?: ReactNode;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#db6f90] text-white shadow-[0_10px_24px_rgba(201,111,135,.28)] hover:bg-[#cf5d82] disabled:bg-[#db6f90]/60 disabled:shadow-none",
  secondary:
    "bg-white/80 text-[#b85f78] border border-[#f1c4d0] hover:bg-white disabled:opacity-60",
  ghost:
    "bg-white/70 text-[#b85f78] hover:bg-[#fff3f7] disabled:opacity-60",
  danger:
    "bg-white/70 text-[#c86f87] hover:bg-[#fff3f7] disabled:opacity-60",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[15px]",
};

function variantLabel(variant: ButtonVariant, label: string) {
  return label;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel,
    icon,
    iconPosition = "left",
    block,
    type = "button",
    disabled,
    className,
    children,
    "aria-label": ariaLabel,
    ...rest
  } = props;

  const isIconOnly = icon != null && children == null;
  const computedAriaLabel = ariaLabel ?? (isIconOnly ? undefined : undefined);

  const baseClasses = [
    "inline-flex items-center justify-center gap-2 rounded-full font-normal transition",
    "invite-focus disabled:cursor-not-allowed",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    block ? "w-full" : "",
    isIconOnly ? "px-0 w-11" : "",
    loading ? "cursor-wait" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const finalAriaLabel =
    ariaLabel ?? (isIconOnly && typeof children === "string" ? children : undefined);

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={finalAriaLabel}
      data-variant={variant}
      data-loading={loading || undefined}
      className={[baseClasses, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel ?? variantLabel(variant, "Salvando…")}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" ? <span aria-hidden="true">{icon}</span> : null}
          {children}
          {icon && iconPosition === "right" ? <span aria-hidden="true">{icon}</span> : null}
        </>
      )}
    </button>
  );
});