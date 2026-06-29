import { forwardRef, useId, type ReactNode, type ChangeEventHandler } from "react";

export type FormFieldProps = {
  id?: string;
  label: string;
  as?: "input" | "select";
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  name?: string;
  className?: string;
  /** Mensagem de erro de validação; quando presente marca o campo como inválido. */
  error?: string;
  children?: ReactNode;
};

export const FormField = forwardRef<HTMLInputElement | HTMLSelectElement, FormFieldProps>(
  function FormField(props, ref) {
    const {
      id: idProp,
      label,
      as = "input",
      type = "text",
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled,
      required,
      min,
      max,
      maxLength,
      inputMode,
      name,
      className,
      error,
      children,
    } = props;

    const reactId = useId();
    const id = idProp ?? reactId;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    const labelClasses = "invite-label block";
    const fieldClasses = [
      "invite-field",
      hasError ? "invite-field-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const errorMessage = hasError ? (
      <span id={errorId} role="alert" className="invite-field-error-text">
        {error}
      </span>
    ) : null;

    if (as === "select") {
      const handleChange = onChange as ChangeEventHandler<HTMLSelectElement>;
      return (
        <label className="block space-y-1.5">
          <span className={labelClasses}>{label}</span>
          <select
            id={id}
            name={name}
            value={value as string | number | undefined}
            defaultValue={defaultValue as string | number | undefined}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className={fieldClasses}
            ref={ref as React.Ref<HTMLSelectElement>}
          >
            {children}
          </select>
          {errorMessage}
        </label>
      );
    }

    const handleChange = onChange as ChangeEventHandler<HTMLInputElement>;
    return (
      <label className="block space-y-1.5">
        <span className={labelClasses}>{label}</span>
        <input
          id={id}
          name={name}
          type={type}
          value={value as string | number | undefined}
          defaultValue={defaultValue as string | number | undefined}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className={fieldClasses}
          ref={ref as React.Ref<HTMLInputElement>}
        />
        {errorMessage}
      </label>
    );
  },
);