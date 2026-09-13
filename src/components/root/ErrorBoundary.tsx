import { Component, type ReactNode } from "react";
import { ErrorState } from "../ui/error-state";
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <ErrorState retry={() => this.setState({ failed: false })} />
    ) : (
      this.props.children
    );
  }
}
