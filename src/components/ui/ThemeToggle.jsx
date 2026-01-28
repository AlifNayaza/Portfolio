import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: 'var(--color-line)',
        border: '1px solid var(--color-border)'
      }}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className="absolute inset-0 transition-all duration-300"
          style={{
            opacity: theme === 'light' ? 1 : 0,
            transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
            color: 'var(--color-gold)'
          }}
          size={20}
        />
        
        {/* Moon Icon */}
        <Moon
          className="absolute inset-0 transition-all duration-300"
          style={{
            opacity: theme === 'dark' ? 1 : 0,
            transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0)',
            color: 'var(--color-crimson)'
          }}
          size={20}
        />
      </div>
    </button>
  );
}