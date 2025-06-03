// src/hooks/useDarkMode.ts
import { useEffect, useState } from 'react';

const useDarkMode = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;
