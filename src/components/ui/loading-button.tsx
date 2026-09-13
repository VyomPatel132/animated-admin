import type { ButtonHTMLAttributes } from "react";
import { Button } from "./button";
import { LoaderCircle } from "lucide-react";

export function LoadingButton({
  loading,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading: boolean }) {
  return (
    <Button variant="primary" disabled={loading} {...props}>
      {loading ? <LoaderCircle size={16} className="spin" /> : null}
      {children}
    </Button>
  );
}