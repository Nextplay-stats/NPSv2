// components/ThemeToggle.tsx
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded bg-gray-200 dark:bg-gray-800">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
