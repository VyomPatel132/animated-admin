import type { ButtonHTMLAttributes } from "react";

export function IconButton({
  children,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button aria-label={label} title={label} className="icon-button" {...props}>
      {children}
    </button>
  );
}
