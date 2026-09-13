import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

export const themeTokens = {
  dark: {
    pageBg:
      'radial-gradient(circle at 20% 20%, #1B4B4A 0%, transparent 45%), radial-gradient(circle at 80% 15%, #C97B4A 0%, transparent 40%), radial-gradient(circle at 50% 90%, #14343E 0%, transparent 50%), linear-gradient(160deg, #0B1B22 0%, #12262B 50%, #1B2A2E 100%)',
    dashboardBg: '#0F1E22',
    cardBg: 'rgba(255,255,255,0.08)',
    cardBorder: 'rgba(255,255,255,0.25)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.6)',
    textMuted: 'rgba(255,255,255,0.45)',
    inputBorder: 'rgba(255,255,255,0.35)',
    inputBorderFocus: '#FFFFFF',
    buttonBg: '#FFFFFF',
    buttonText: '#12262B',
    accent: '#C97B4A',
    error: '#FFB4A8',
    monacoTheme: 'vs-dark',
    editorHeaderBg: '#0F1E22',
    editorSelectBg: '#17282C',
    lineColor: 'rgba(255,255,255,0.08)',
  },
  light: {
    pageBg:
      'radial-gradient(circle at 20% 20%, #CFE8E4 0%, transparent 45%), radial-gradient(circle at 80% 15%, #F4D9C6 0%, transparent 40%), radial-gradient(circle at 50% 90%, #E4EFEE 0%, transparent 50%), linear-gradient(160deg, #FDFCFA 0%, #F6F5F2 50%, #F1EFEA 100%)',
    dashboardBg: '#F6F5F2',
    cardBg: 'rgba(255,255,255,0.55)',
    cardBorder: 'rgba(18,38,43,0.15)',
    textPrimary: '#12262B',
    textSecondary: 'rgba(18,38,43,0.65)',
    textMuted: 'rgba(18,38,43,0.45)',
    inputBorder: 'rgba(18,38,43,0.3)',
    inputBorderFocus: '#12262B',
    buttonBg: '#12262B',
    buttonText: '#FFFFFF',
    accent: '#B35F2E',
    error: '#C41230',
    monacoTheme: 'light',
    editorHeaderBg: '#EFEDE8',
    editorSelectBg: '#FFFFFF',
    lineColor: 'rgba(18,38,43,0.1)',
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const value = useMemo(
    () => ({ theme, toggleTheme, tokens: themeTokens[theme] }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}