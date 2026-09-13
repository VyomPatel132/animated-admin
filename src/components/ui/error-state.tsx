import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="empty-state">
      <AlertCircle size={32} />
      <h3>Something didn’t load</h3>
      <p>Let’s give it another try.</p>
      <Button onClick={retry}>Try again</Button>
    </div>
  );
}