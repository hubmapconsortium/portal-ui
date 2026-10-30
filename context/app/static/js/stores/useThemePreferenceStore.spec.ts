// The store reads the cookie when the module loads, so each test sets the cookie and then imports a fresh copy.
async function loadStore(cookie?: string) {
  document.cookie = 'portal_theme=; Max-Age=0; path=/';
  if (cookie) {
    document.cookie = cookie;
  }
  vi.resetModules();
  return import('./useThemePreferenceStore');
}

function mockSystemDark(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) => ({ matches, media: query }) as unknown as MediaQueryList,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('defaults to light without a cookie', async () => {
  const { getInitialThemeMode, useThemePreferenceStore } = await loadStore();
  expect(useThemePreferenceStore.getState().preference).toBe('light');
  expect(getInitialThemeMode()).toBe('light');
});

test('ignores an unknown cookie value', async () => {
  const { useThemePreferenceStore } = await loadStore('portal_theme=purple');
  expect(useThemePreferenceStore.getState().preference).toBe('light');
});

test('reads a saved preference', async () => {
  const { getInitialThemeMode } = await loadStore('portal_theme=dark');
  expect(getInitialThemeMode()).toBe('dark');
});

test('resolves system to the OS setting', async () => {
  const { getInitialThemeMode } = await loadStore('portal_theme=system');
  mockSystemDark(true);
  expect(getInitialThemeMode()).toBe('dark');
  mockSystemDark(false);
  expect(getInitialThemeMode()).toBe('light');
});

test('setPreference saves the cookie and removes the server-rendered background', async () => {
  const { useThemePreferenceStore } = await loadStore();
  const preload = document.createElement('style');
  preload.id = 'theme-preload';
  document.head.appendChild(preload);

  useThemePreferenceStore.getState().setPreference('dark');

  expect(useThemePreferenceStore.getState().preference).toBe('dark');
  expect(document.cookie).toContain('portal_theme=dark');
  expect(document.getElementById('theme-preload')).toBeNull();
});
