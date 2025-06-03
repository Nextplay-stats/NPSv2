// hooks/useStoredName.ts
import { useEffect, useState } from 'react';

export default function useStoredName(key = 'name', defaultValue = 'Guest') {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) setValue(stored);
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
