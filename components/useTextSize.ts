import { useState, useEffect } from 'react';

type TextSize = 'small' | 'medium' | 'large';

const TEXT_SIZE_STORAGE_KEY = 'textSize';

export default function useTextSize() {
  const [textSize, setTextSize] = useState<TextSize>('medium');

  useEffect(() => {
    const saved = localStorage.getItem(TEXT_SIZE_STORAGE_KEY) as TextSize | null;
    if (saved) {
      setTextSize(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TEXT_SIZE_STORAGE_KEY, textSize);
  }, [textSize]);

  return [textSize, setTextSize] as const;
}
