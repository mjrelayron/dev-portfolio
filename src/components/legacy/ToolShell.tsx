import type { ReactNode } from 'react';
import './legacy.css';

/**
 * Wraps a legacy lead tool (simulators, quote generators, Workflow Challenger,
 * Scraping Dashboard, AI chat, English practice). The tool's logic is untouched;
 * this scope re-themes its CSS variables and Tailwind greys to the navy palette.
 * The stylesheet is only fetched with the chunk that renders a tool.
 */
export function ToolShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`tool-shell ${className}`}>{children}</div>;
}
