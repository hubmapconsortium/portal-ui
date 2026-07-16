import React, { PropsWithChildren } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import { useAppContext } from 'js/components/Contexts';
import { useSavedPreferences } from 'js/components/savedLists/hooks';
import { trackEvent } from 'js/helpers/trackers';
import theme from 'js/theme/theme';

import SaySeePanel from './SaySeePanel';

function Wrapper({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

vi.mock('js/helpers/trackers');
vi.mock('js/components/Contexts', () => ({
  useAppContext: vi.fn(),
}));
vi.mock('js/components/savedLists/hooks', () => ({
  useSavedPreferences: vi.fn(),
}));
vi.mock('udi-yac', () => ({
  __esModule: true,
  UDIChat: ({
    dataPackagePath,
    onEvent,
    palette,
  }: {
    dataPackagePath: string;
    onEvent?: (name: string, properties?: Record<string, unknown>) => void;
    palette?: { category?: unknown[]; mark?: string };
  }) => (
    <div
      data-testid="udi-chat"
      data-path={dataPackagePath}
      data-palette-count={palette?.category?.length}
      data-palette-mark={palette?.mark}
    >
      <button
        type="button"
        data-testid="fire-event"
        onClick={() => onEvent?.('message_sent', { foo: 'bar', sessionId: 'abc' })}
      />
    </div>
  ),
}));
vi.mock('udi-yac/style.css', () => ({}));
vi.mock('./SeeSayPanelDescription', () => ({
  __esModule: true,
  default: () => <div data-testid="say-see-description" />,
}));
vi.mock('./SaySeeWelcomeDialog', () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock('./OpenInWorkspacesFromYAC', () => ({
  __esModule: true,
  default: () => <div data-testid="open-in-workspaces" />,
}));

const mockUseAppContext = vi.mocked(useAppContext);
const mockUseSavedPreferences = vi.mocked(useSavedPreferences);
const mockTrackEvent = vi.mocked(trackEvent);

interface AppContextOverrides {
  isAuthenticated?: boolean;
  isHubmapUser?: boolean;
  isWorkspacesUser?: boolean;
}

interface PrefsOverrides {
  scope?: 'public' | 'authenticated';
  isLoading?: boolean;
}

function setup(app: AppContextOverrides = {}, prefs: PrefsOverrides = {}) {
  mockUseAppContext.mockReturnValue({
    isAuthenticated: false,
    isHubmapUser: false,
    isWorkspacesUser: false,
    ...app,
  } as unknown as ReturnType<typeof useAppContext>);
  mockUseSavedPreferences.mockReturnValue({
    savedPreferences: prefs.scope ? { saySeeDataScope: prefs.scope } : {},
    handleUpdateSavedPreferences: vi.fn(),
    isLoading: prefs.isLoading ?? false,
    mutate: vi.fn(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SaySeePanel', () => {
  it('points dataPackagePath at the public endpoint by default for a HuBMAP user', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true });
    render(<SaySeePanel />, { wrapper: Wrapper });
    const chat = await screen.findByTestId('udi-chat');
    expect(chat).toHaveAttribute('data-path', '/metadata/v0/udi/datapackage.json');
  });

  it('points dataPackagePath at the consortium endpoint when a HuBMAP user has opted in', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true }, { scope: 'authenticated' });
    render(<SaySeePanel />, { wrapper: Wrapper });
    const chat = await screen.findByTestId('udi-chat');
    expect(chat).toHaveAttribute('data-path', '/metadata/v0/udi/consortium/datapackage.json');
  });

  it('forces the public endpoint even if a non-HuBMAP user has a stale "authenticated" preference', async () => {
    setup({ isAuthenticated: true, isHubmapUser: false }, { scope: 'authenticated' });
    render(<SaySeePanel />, { wrapper: Wrapper });
    const chat = await screen.findByTestId('udi-chat');
    expect(chat).toHaveAttribute('data-path', '/metadata/v0/udi/datapackage.json');
  });

  it('does not mount UDIChat while saved preferences are still loading', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true }, { isLoading: true });
    render(<SaySeePanel />, { wrapper: Wrapper });
    // Wait a tick to allow Suspense to settle without UDIChat mounting.
    await waitFor(() => expect(mockUseSavedPreferences).toHaveBeenCalled());
    expect(screen.queryByTestId('udi-chat')).not.toBeInTheDocument();
  });

  it('keeps UDIChat mounted if isLoading flips back to true after a successful resolve', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true });
    const { rerender } = render(<SaySeePanel />, { wrapper: Wrapper });
    const initialChat = await screen.findByTestId('udi-chat');

    // Simulate a background SWR revalidation that lost its cache: isLoading
    // flips back to true. UDIChat must not unmount.
    setup({ isAuthenticated: true, isHubmapUser: true }, { isLoading: true });
    rerender(<SaySeePanel />);

    expect(screen.getByTestId('udi-chat')).toBe(initialChat);
  });

  it('hides OpenInWorkspacesFromYAC for non-Workspaces users', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true, isWorkspacesUser: false });
    render(<SaySeePanel />, { wrapper: Wrapper });
    await screen.findByTestId('udi-chat');
    expect(screen.queryByTestId('open-in-workspaces')).not.toBeInTheDocument();
  });

  it('renders OpenInWorkspacesFromYAC for Workspaces users', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true, isWorkspacesUser: true });
    render(<SaySeePanel />, { wrapper: Wrapper });
    expect(await screen.findByTestId('open-in-workspaces')).toBeInTheDocument();
  });

  it('maps UDIChat events into the Say & See category with the event name as the action', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true });
    render(<SaySeePanel />, { wrapper: Wrapper });
    fireEvent.click(await screen.findByTestId('fire-event'));
    // Both Matomo and GA require category + action; the sessionId is threaded
    // through as the id arg, not left in the event body.
    expect(mockTrackEvent).toHaveBeenCalledWith({ foo: 'bar', category: 'Say & See', action: 'message_sent' }, 'abc');
  });

  it('passes the portal brand palette to UDIChat', async () => {
    setup({ isAuthenticated: true, isHubmapUser: true });
    render(<SaySeePanel />, { wrapper: Wrapper });
    const chat = await screen.findByTestId('udi-chat');
    // 18 theme-derived categorical colors (6 palette colors × light/main/dark)
    // and brand primary as the single-mark color.
    expect(chat).toHaveAttribute('data-palette-count', '18');
    expect(chat).toHaveAttribute('data-palette-mark', theme.palette.primary.main);
  });
});
