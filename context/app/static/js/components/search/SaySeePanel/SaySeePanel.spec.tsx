import React, { PropsWithChildren } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import { useAppContext } from 'js/components/Contexts';
import { useSavedPreferences } from 'js/components/savedLists/hooks';
import theme from 'js/theme/theme';

import SaySeePanel from './SaySeePanel';

function Wrapper({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

jest.mock('js/helpers/trackers');
jest.mock('js/components/Contexts', () => ({
  useAppContext: jest.fn(),
}));
jest.mock('js/components/savedLists/hooks', () => ({
  useSavedPreferences: jest.fn(),
}));
jest.mock(
  'udi-yac',
  () => ({
    __esModule: true,
    UDIChat: ({ dataPackagePath }: { dataPackagePath: string }) => (
      <div data-testid="udi-chat" data-path={dataPackagePath} />
    ),
  }),
  { virtual: true },
);
jest.mock('udi-yac/style.css', () => ({}), { virtual: true });
jest.mock('./SeeSayPanelDescription', () => ({
  __esModule: true,
  default: () => <div data-testid="say-see-description" />,
}));
jest.mock('./SaySeeWelcomeDialog', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./OpenInWorkspacesFromYAC', () => ({
  __esModule: true,
  default: () => <div data-testid="open-in-workspaces" />,
}));

const mockUseAppContext = jest.mocked(useAppContext);
const mockUseSavedPreferences = jest.mocked(useSavedPreferences);

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
    handleUpdateSavedPreferences: jest.fn(),
    isLoading: prefs.isLoading ?? false,
    mutate: jest.fn(),
  } as unknown as ReturnType<typeof useSavedPreferences>);
}

beforeEach(() => {
  jest.clearAllMocks();
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
});
