import { Component, type ReactNode } from "react";

interface Props {
  /** Rendered in place of `children` once they throw. */
  fallback: ReactNode;
  children: ReactNode;
}

/**
 * Minimal error boundary — pairs with `<Suspense>` around suspense queries so a
 * failed request degrades just its own section. Remount it (via `key`) to reset.
 */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
