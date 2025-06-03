import { useState, useEffect } from 'react';

export default function useDarkMode(): [boolean, (value: boolean) => void] {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode];
}
