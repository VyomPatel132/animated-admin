import type { ReactNode } from "react";

export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  const type =
    tone ||
    (String(children).match(/Completed|Active|In stock|Paid/)
      ? "success"
      : String(children).match(/Pending|Low stock/)
        ? "warning"
        : String(children).match(/Cancelled/)
          ? "danger"
          : "info");
  return (
    <span className={`badge ${type}`}>
      <span />
      {children}
    </span>
  );
}
