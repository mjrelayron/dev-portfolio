import { createContext, useContext } from 'react';
import type { AppId } from '../store/useWindows';
import { useWindows } from '../store/useWindows';

export interface OsApi {
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
}

/** Desktop opens windows; the mobile shell swaps full-screen panels. */
export const OsContext = createContext<OsApi>({
  openApp: (id) => useWindows.getState().open(id),
  closeApp: (id) => useWindows.getState().close(id),
});

export const useOs = () => useContext(OsContext);
