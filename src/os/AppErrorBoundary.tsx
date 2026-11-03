import { Component, type ReactNode } from 'react';

/** Keeps one broken app from taking the whole desktop down. */
export class AppErrorBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div>
          <p className="font-display text-lg font-bold">{this.props.name} hit a snag</p>
          <p className="mt-1 text-sm text-ink-2">Close the window and open it again, or reload the page.</p>
          <button type="button" className="btn-3d btn-3d--ghost btn-3d--sm mt-4" onClick={() => this.setState({ failed: false })}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}
