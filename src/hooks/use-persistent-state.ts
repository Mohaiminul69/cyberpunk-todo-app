import { useEffect, useState } from "react";

const read = <T,>(key: string, initial: T, revive?: (stored: unknown) => T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return initial;
    const parsed: unknown = JSON.parse(stored);
    return revive ? revive(parsed) : (parsed as T);
  } catch {
    // Blocked storage or corrupt data: start fresh rather than crash
    return initial;
  }
};

/**
 * useState that's saved to localStorage under `key` and restored on load.
 * `revive` can check or fill in old saved data. Changes made in another
 * tab are picked up too.
 */
export const usePersistentState = <T,>(
  key: string,
  initial: T,
  revive?: (stored: unknown) => T,
) => {
  const [value, setValue] = useState<T>(() => read(key, initial, revive));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: keep working in memory
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read(key, initial, revive));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // initial/revive are only used as fallbacks when re-reading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue] as const;
};
