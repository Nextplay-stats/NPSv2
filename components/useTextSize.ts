import { useState, useEffect } from 'react';

type TextSize = 'small' | 'medium' | 'large';

const TEXT_SIZE_STORAGE_KEY = 'textSize';

function isValidTextSize(value: any): value is TextSize {
  return ['small', 'medium', 'large'].includes(value);
}

export default function useTextSize() {
  const [textSize, setTextSize] = useState<TextSize>('medium');

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety

    const saved = localStorage.getItem(TEXT_SIZE_STORAGE_KEY);
    if (saved && isValidTextSize(saved)) {
      setTextSize(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(TEXT_SIZE_STORAGE_KEY, textSize);
  }, [textSize]);

  return [textSize, setTextSize] as const;
}
