import type { HTMLAttributes, ReactNode, FormHTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div";
  children: ReactNode;
};

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  as: "form";
  children: ReactNode;
};

export type SectionCardProps = DivProps | FormProps;

export function SectionCard(props: SectionCardProps) {
  if (props.as === "form") {
    const { children, className, as: _as, ...rest } = props;
    return (
      <form
        {...(rest as FormHTMLAttributes<HTMLFormElement>)}
        className={["invite-card", className].filter(Boolean).join(" ")}
      >
        {children}
      </form>
    );
  }
  const { children, className, ...rest } = props;
  return (
    <div
      {...(rest as HTMLAttributes<HTMLDivElement>)}
      className={["invite-card", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}