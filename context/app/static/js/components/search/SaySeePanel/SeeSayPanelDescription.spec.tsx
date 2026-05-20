import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useAppContext } from 'js/components/Contexts';
import { useSavedPreferences } from 'js/components/savedLists/hooks';
import { trackEvent } from 'js/helpers/trackers';

import SaySeePanelDescription from './SeeSayPanelDescription';

vi.mock('js/helpers/trackers');
vi.mock('js/components/Contexts', () => ({
  useAppContext: vi.fn(),
}));
vi.mock('js/components/savedLists/hooks', () => ({
  useSavedPreferences: vi.fn(),
}));

const mockUseAppContext = vi.mocked(useAppContext);
const mockUseSavedPreferences = vi.mocked(useSavedPreferences);
const mockTrackEvent = vi.mocked(trackEvent);
const mockHandleUpdateSavedPreferences = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockUseSavedPreferences.mockReturnValue({
    savedPreferences: {},
    handleUpdateSavedPreferences: mockHandleUpdateSavedPreferences,
    isLoading: false,
    mutate: vi.fn(),
  });
});

function setAppContext(overrides: { isAuthenticated?: boolean; isHubmapUser?: boolean }) {
  mockUseAppContext.mockReturnValue({
    isAuthenticated: false,
    isHubmapUser: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAppContext>);
}

describe('SaySeePanelDescription DataScopeSwitch', () => {
  it('does not render the data-scope switch for an unauthenticated user', () => {
    setAppContext({ isAuthenticated: false });
    render(<SaySeePanelDescription />);
    expect(screen.queryByText('Data scope')).not.toBeInTheDocument();
  });

  it('does not render the data-scope switch for an authed non-HuBMAP user', () => {
    setAppContext({ isAuthenticated: true, isHubmapUser: false });
    render(<SaySeePanelDescription />);
    expect(screen.queryByText('Data scope')).not.toBeInTheDocument();
  });

  it('renders an unchecked switch for a HuBMAP user with no saved preference', () => {
    setAppContext({ isAuthenticated: true, isHubmapUser: true });
    render(<SaySeePanelDescription />);
    expect(screen.getByText('Data scope')).toBeInTheDocument();
    const toggle = screen.getByRole('checkbox', {
      name: /Toggle whether Say & See uses public data/i,
    });
    expect(toggle).not.toBeChecked();
  });

  it('renders a checked switch when saySeeDataScope is "authenticated"', () => {
    setAppContext({ isAuthenticated: true, isHubmapUser: true });
    mockUseSavedPreferences.mockReturnValue({
      savedPreferences: { saySeeDataScope: 'authenticated' },
      handleUpdateSavedPreferences: mockHandleUpdateSavedPreferences,
      isLoading: false,
      mutate: vi.fn(),
    } as unknown as ReturnType<typeof useSavedPreferences>);

    render(<SaySeePanelDescription />);
    expect(screen.getByRole('checkbox', { name: /Toggle whether Say & See uses public data/i })).toBeChecked();
  });

  it('flipping the switch persists the new scope and emits a tracking event', async () => {
    const user = userEvent.setup();
    setAppContext({ isAuthenticated: true, isHubmapUser: true });
    mockUseSavedPreferences.mockReturnValue({
      savedPreferences: { enableOpenKeyNav: true },
      handleUpdateSavedPreferences: mockHandleUpdateSavedPreferences,
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<SaySeePanelDescription />);
    await user.click(screen.getByRole('checkbox', { name: /Toggle whether Say & See uses public data/i }));

    expect(mockHandleUpdateSavedPreferences).toHaveBeenCalledTimes(1);
    expect(mockHandleUpdateSavedPreferences).toHaveBeenCalledWith({
      enableOpenKeyNav: true,
      saySeeDataScope: 'authenticated',
    });
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Say & See',
      action: 'Toggle Data Scope',
      label: 'authenticated',
    });
  });
});
