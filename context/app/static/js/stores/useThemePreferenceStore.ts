import { create } from 'zustand';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';

const themePreferences: ThemePreference[] = ['light', 'dark', 'system'];

// Flask reads this cookie too, so base.html can paint the dark background before the JS loads.
const THEME_COOKIE_KEY = 'portal_theme';
const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

function readThemePreferenceCookie(): ThemePreference {
  const value = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${THEME_COOKIE_KEY}=`))
    ?.split('=')[1];
  return themePreferences.find((preference) => preference === value) ?? 'light';
}

interface ThemePreferenceStore {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemePreferenceStore = create<ThemePreferenceStore>((set) => ({
  preference: readThemePreferenceCookie(),
  setPreference: (preference) => {
    document.cookie = `${THEME_COOKIE_KEY}=${preference}; Max-Age=31536000; path=/; SameSite=Lax`;
    // The server-rendered background only covers the first paint; the MUI theme takes over from here.
    document.getElementById('theme-preload')?.remove();
    set({ preference });
  },
}));

/**
 * The theme mode at page load, for state that is initialized outside React.
 */
export function getInitialThemeMode(): ThemeMode {
  const { preference } = useThemePreferenceStore.getState();
  if (preference === 'system') {
    return window.matchMedia(SYSTEM_DARK_QUERY).matches ? 'dark' : 'light';
  }
  return preference;
}

/**
 * The theme mode to render, following the OS setting when the preference is 'system'.
 */
export function useThemeMode(): ThemeMode {
  const preference = useThemePreferenceStore((state) => state.preference);
  const systemIsDark = useMediaQuery(SYSTEM_DARK_QUERY, { noSsr: true });
  if (preference === 'system') {
    return systemIsDark ? 'dark' : 'light';
  }
  return preference;
}

export default useThemePreferenceStore;
