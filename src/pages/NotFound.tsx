import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EmptyState } from "../components/ui/empty-state";
export default function NotFound() {
  return (
    <EmptyState
      title="A little off the beaten path."
      description="We couldn’t find this page. Let’s get you back to familiar ground."
    >
      <Link className="button primary" to="/dashboard">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>
    </EmptyState>
  );
}
