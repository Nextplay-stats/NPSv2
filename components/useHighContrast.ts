import { useState, useEffect } from 'react';

export default function useHighContrast() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('highContrast');
    setHighContrast(saved === 'true');
  }, []);

  useEffect(() => {
    if (highContrast) {
      document.body.setAttribute('data-contrast', 'high');
    } else {
      document.body.removeAttribute('data-contrast');
    }
  }, [highContrast]);

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      localStorage.setItem('highContrast', next.toString());
      return next;
    });
  };

  return [highContrast, toggleHighContrast] as const;
}
