import { useSyncExternalStore } from 'react';

// Who is showing the gold couple names: the hero on its own ('idle'),
// the intro video overlay ('intro'), or the hero after the intro handed over ('handedOff').
export type NamesOwner = 'idle' | 'intro' | 'handedOff';

let owner: NamesOwner = 'idle';
const listeners = new Set<() => void>();

export function setNamesOwner(next: NamesOwner) {
  owner = next;
  listeners.forEach((l) => l());
}

export function useNamesOwner() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => owner,
  );
}
