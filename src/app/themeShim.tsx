import type { ReactNode } from 'react';

// Stand-in for next-themes: the site has a single dark theme. Legacy tools
// still call useTheme(); `html.dark` is set statically in index.html.
export function useTheme() {
  return { theme: 'dark', resolvedTheme: 'dark', systemTheme: 'dark', themes: ['dark'], setTheme: () => {} };
}

export function ThemeProvider({ children }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}
